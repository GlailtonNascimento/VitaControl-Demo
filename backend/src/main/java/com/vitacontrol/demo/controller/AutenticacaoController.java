package com.vitacontrol.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AutenticacaoController {

    // Controlador desativado - todos os endpoints de autenticação
    // foram movidos para o AuthController.

    @GetMapping("/status")
    public ResponseEntity<?> status() {
        return ResponseEntity.ok(Map.of("status", "AutenticacaoController inativo"));
    }
}
