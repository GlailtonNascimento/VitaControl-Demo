package com.vitacontrol.demo.security;

import com.vitacontrol.demo.model.Usuario;
import com.vitacontrol.demo.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // CORRIGIDO: Adicionado /api para bater com o Security e o Angular
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(AuthenticationManager authenticationManager, UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // Endpoint de Registro de novos Utilizadores
    @PostMapping("/register") // CORRIGIDO: Mapeado em inglês para bater com a chamada do Angular
    public ResponseEntity<?> registrar(@RequestBody RegistoRequest request) {
        if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Erro: Nome de utilizador já existe!");
        }

        Usuario novoUsuario = new Usuario(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()) // Salva a senha criptografada
        );

        usuarioRepository.save(novoUsuario);
        return ResponseEntity.ok("Utilizador registado com sucesso!");
    }

    // Endpoint de Login (Gera e retorna o Token JWT)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado!"));

        String token = jwtTokenProvider.generateToken(usuario);
        return ResponseEntity.ok(new AuthenticationResponse(token));
    }
}

// Classes auxiliares (DTOs) limpas e sem duplicidade
class RegistoRequest {
    private String username;
    private String password;
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class LoginRequest {
    private String username;
    private String password;
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class AuthenticationResponse {
    private String token;
    public AuthenticationResponse(String token) { this.token = token; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}

