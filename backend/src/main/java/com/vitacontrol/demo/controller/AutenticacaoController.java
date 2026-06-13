package com.vitacontrol.demo.controller;

import com.vitacontrol.demo.service.AutenticacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AutenticacaoController {

    @Autowired
    private AutenticacaoService autenticacaoService;

    @PostMapping("/recuperar-senha")
    public ResponseEntity<?> recuperarSenha(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", "O e-mail é obrigatório"));
        }
        String resultado = autenticacaoService.solicitarRecuperacaoSenha(email);
        return ResponseEntity.ok(Map.of("mensagem", resultado, "status", "sucesso"));
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody Map<String, String> dados) {
        String token = dados.get("token");
        String novaSenha = dados.get("novaSenha");
        try {
            autenticacaoService.atualizarSenhaComToken(token, novaSenha);
            return ResponseEntity.ok(Map.of("mensagem", "Senha alterada com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", e.getMessage()));
        }
    }
}

