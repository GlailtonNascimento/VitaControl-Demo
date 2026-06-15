package com.vitacontrol.demo.security;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.vitacontrol.demo.model.Usuario;
import com.vitacontrol.demo.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager auth, UsuarioRepository repo, PasswordEncoder encoder) {
        this.authenticationManager = auth;
        this.usuarioRepository = repo;
        this.passwordEncoder = encoder;
    }

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

class RegistoRequest {
    private String username;
    private String password;
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
