package com.vitacontrol.demo.security;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.vitacontrol.demo.model.Usuario;
import com.vitacontrol.demo.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200") // Conexão direta com o Angular local
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    // Construtor expandido para suportar a geração do Token após o login
    public AuthController(AuthenticationManager auth, UsuarioRepository repo, 
                          PasswordEncoder encoder, JwtTokenProvider jwtProvider,
                          UserDetailsService userDetailsSrv) {
        this.authenticationManager = auth;
        this.usuarioRepository = repo;
        this.passwordEncoder = encoder;
        this.jwtTokenProvider = jwtProvider;
        this.userDetailsService = userDetailsSrv;
    }

    // 🔥 NOVO: Endpoint de Login que faltava para fechar os 15% do ecossistema!
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Valida as credenciais comparando com o hash BCrypt do PostgreSQL
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            
            // Se passar pelo teste, busca os dados do usuário e gera o token assinado
            final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
            final String token = jwtTokenProvider.generateToken(userDetails);
            
            // Devolve o JSON limpo { "token": "..." } para o LocalStorage do Angular
            return ResponseEntity.ok(Map.of("token", token));
            
        } catch (Exception e) {
            // Retorna erro 401 (Não Autorizado) caso a senha ou usuário estejam errados
            return ResponseEntity.status(401).body(Map.of("mensagem", "Usuário ou senha inválidos."));
        }
    }

    // Seu método de registro original foi mantido 100% intacto aqui
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody RegistoRequest request) {
        if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("mensagem", "E-mail já cadastrado."));
        }
        Usuario novoUsuario = new Usuario(request.getUsername(), passwordEncoder.encode(request.getPassword()));
        usuarioRepository.save(novoUsuario);
        return ResponseEntity.ok(Map.of("mensagem", "Cadastro realizado com sucesso!"));
    }
}

// DTO para receber o payload do Angular no Login
class LoginRequest {
    private String username;
    private String password;
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

// Seu DTO original mantido intacto
class RegistoRequest {
    private String username;
    private String password;
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

