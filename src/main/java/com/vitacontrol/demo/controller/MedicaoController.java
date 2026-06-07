package com.vitacontrol.demo.controller;

import com.vitacontrol.demo.model.MedicaoPressao;
import com.vitacontrol.demo.model.Usuario;
import com.vitacontrol.demo.repository.MedicaoPressaoRepository;
import com.vitacontrol.demo.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class MedicaoController {

    private final MedicaoPressaoRepository repository;
    private final UsuarioRepository usuarioRepository;

    // Injeção via construtor (boas práticas)
    public MedicaoController(MedicaoPressaoRepository repository, UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    // Recupera o usuário autenticado no contexto de segurança do Spring/JWT
    private Usuario getUsuarioAutenticado() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
    }

    @PostMapping("/medicoes")
    public ResponseEntity<?> salvar(@RequestBody Map<String, Object> payload) {
        try {
            Usuario usuarioLogado = getUsuarioAutenticado();

            Short sistolica = ((Number) payload.get("sistolica")).shortValue();
            Short diastolica = ((Number) payload.get("diastolica")).shortValue();
            Short pulsacao = payload.get("pulsacao") != null ?
                ((Number) payload.get("pulsacao")).shortValue() : null;
            String contexto = (String) payload.get("contexto");
            LocalDateTime dataHora = LocalDateTime.now();

            // Instancia a medição atrelando o objeto físico do Usuário logado
            MedicaoPressao medicao = new MedicaoPressao(
                    usuarioLogado,
                    dataHora,
                    sistolica,
                    diastolica,
                    pulsacao,
                    contexto
            );

            repository.save(medicao);
            return ResponseEntity.status(HttpStatus.CREATED).body(medicao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao salvar: " + e.getMessage());
        }
    }

    @GetMapping("/medicoes")
    public ResponseEntity<?> listarTodas() {
        try {
            Usuario usuarioLogado = getUsuarioAutenticado();
            
            // Retorna estritamente as medições do escopo do usuário autenticado
            return ResponseEntity.ok(repository.findByUsuarioOrderByDataHoraDesc(usuarioLogado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar medições: " + e.getMessage());
        }
    }
}
