
package com.vitacontrol.demo.controller;

import com.vitacontrol.demo.model.MedicaoPressao;
import com.vitacontrol.demo.repository.MedicaoPressaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
 
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class MedicaoController {

    @Autowired
    private MedicaoPressaoRepository repository;

    @PostMapping("/medicoes")
    public ResponseEntity<?> salvar(@RequestBody Map<String, Object> payload) {
        try {
            Long usuarioId = ((Number) payload.get("usuarioId")).longValue();
            Short sistolica = ((Number) payload.get("sistolica")).shortValue();
            Short diastolica = ((Number) payload.get("diastolica")).shortValue();
            Short pulsacao = payload.get("pulsacao") != null ? 
                ((Number) payload.get("pulsacao")).shortValue() : null;
            String contexto = (String) payload.get("contexto");
            LocalDateTime dataHora = LocalDateTime.now();

            MedicaoPressao medicao = new MedicaoPressao();
            medicao.setUsuarioId(usuarioId);
            medicao.setSistolica(sistolica);
            medicao.setDiastolica(diastolica);
            medicao.setPulsacao(pulsacao);
            medicao.setContexto(contexto);
            medicao.setDataHora(dataHora);

            repository.save(medicao);
            return ResponseEntity.status(HttpStatus.CREATED).body(medicao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao salvar: " + e.getMessage());
        }
    }

    @GetMapping("/medicoes")
    public ResponseEntity<?> listarTodas() {
        try {
            return ResponseEntity.ok(repository.findAllByOrderByDataHoraDesc());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar medições: " + e.getMessage());
        }
    }
}


