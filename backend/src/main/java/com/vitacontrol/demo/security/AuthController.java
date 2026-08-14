package com.vitacontrol.demo.security;

import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.vitacontrol.demo.model.Usuario;
import com.vitacontrol.demo.model.CodigoRecuperacao;
import com.vitacontrol.demo.repository.UsuarioRepository;
import com.vitacontrol.demo.repository.CodigoRecuperacaoRepository;
import com.vitacontrol.demo.service.EmailService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;
    private final CodigoRecuperacaoRepository codigoRecuperacaoRepository;

    @Autowired
    private EmailService emailService;

    public AuthController(AuthenticationManager auth,
                          UsuarioRepository repo,
                          PasswordEncoder encoder,
                          JwtTokenProvider jwtProvider,
                          UserDetailsService userDetailsSrv,
                          CodigoRecuperacaoRepository codigoRepo) {
        this.authenticationManager = auth;
        this.usuarioRepository = repo;
        this.passwordEncoder = encoder;
        this.jwtTokenProvider = jwtProvider;
        this.userDetailsService = userDetailsSrv;
        this.codigoRecuperacaoRepository = codigoRepo;
    }

    // ==================== LOGIN ====================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
            final String token = jwtTokenProvider.generateToken(userDetails);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("mensagem", "Usuário ou senha inválidos."));
        }
    }

    // ==================== CADASTRO ====================
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody RegistoRequest request) {
        if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("mensagem", "E-mail já cadastrado."));
        }
        Usuario novoUsuario = new Usuario(
            request.getUsername(),
            passwordEncoder.encode(request.getPassword()),
            request.getNome()
        );
        usuarioRepository.save(novoUsuario);
        return ResponseEntity.ok(Map.of("mensagem", "Cadastro realizado com sucesso!"));
    }

    // ==================== RECUPERAÇÃO DE SENHA ====================

    @Transactional
    @PostMapping("/recuperar-senha")
    public ResponseEntity<?> recuperarSenha(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", "E-mail é obrigatório."));
        }

        if (usuarioRepository.findByUsername(email).isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("mensagem", "E-mail não encontrado."));
        }

        codigoRecuperacaoRepository.deleteByEmail(email);

        String codigo = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiracao = LocalDateTime.now().plusMinutes(15);
        CodigoRecuperacao entity = new CodigoRecuperacao(email, codigo, expiracao);
        codigoRecuperacaoRepository.save(entity);

        emailService.enviarCodigoRecuperacao(email, codigo);

        return ResponseEntity.ok(Map.of("mensagem", "Código enviado para o e-mail informado."));
    }

    @PostMapping("/validar-codigo")
    public ResponseEntity<?> validarCodigo(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String codigo = body.get("codigo");

        if (email == null || codigo == null) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", "E-mail e código são obrigatórios."));
        }

        Optional<CodigoRecuperacao> optional = codigoRecuperacaoRepository.findByEmailAndCodigoAndUsadoFalse(email, codigo);
        if (optional.isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("mensagem", "Código inválido ou expirado."));
        }

        CodigoRecuperacao entity = optional.get();
        if (entity.getExpiracao().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400).body(Map.of("mensagem", "Código expirado. Solicite um novo."));
        }

        return ResponseEntity.ok(Map.of("mensagem", "Código válido."));
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String codigo = body.get("codigo");
        String novaSenha = body.get("novaSenha");

        if (email == null || codigo == null || novaSenha == null) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", "E-mail, código e nova senha são obrigatórios."));
        }

        if (novaSenha.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", "A nova senha deve ter pelo menos 6 caracteres."));
        }

        Optional<CodigoRecuperacao> optional = codigoRecuperacaoRepository.findByEmailAndCodigoAndUsadoFalse(email, codigo);
        if (optional.isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("mensagem", "Código inválido ou expirado."));
        }

        CodigoRecuperacao entity = optional.get();
        if (entity.getExpiracao().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400).body(Map.of("mensagem", "Código expirado. Solicite um novo."));
        }

        Usuario usuario = usuarioRepository.findByUsername(email).get();
        usuario.setPassword(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);

        entity.setUsado(true);
        codigoRecuperacaoRepository.save(entity);

        return ResponseEntity.ok(Map.of("mensagem", "Senha redefinida com sucesso!"));
    }
}

// ==================== DTOS ====================

class LoginRequest {
    private String username;
    private String password;
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class RegistoRequest {
    private String username;
    private String password;
    private String nome;
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
