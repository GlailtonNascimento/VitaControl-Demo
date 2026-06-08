package com.vitacontrol.demo.controller;

import com.vitacontrol.demo.dto.MedicaoRequestDTO;
import com.vitacontrol.demo.model.MedicaoPressao;
import com.vitacontrol.demo.model.Usuario;
import com.vitacontrol.demo.repository.MedicaoPressaoRepository;
import com.vitacontrol.demo.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class MedicaoController {

    private final MedicaoPressaoRepository repository;
    private final UsuarioRepository usuarioRepository;

    public MedicaoController(MedicaoPressaoRepository repository, UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    private Usuario getUsuarioAutenticado() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
    }

    @PostMapping("/medicoes")
    public ResponseEntity<?> salvar(@Valid @RequestBody MedicaoRequestDTO dto) {
        try {
            Usuario usuarioLogado = getUsuarioAutenticado();
            LocalDateTime dataHora = LocalDateTime.now();

            // Mapeia os dados validados do DTO diretamente para a Entidade física
            MedicaoPressao medicao = new MedicaoPressao(
                    usuarioLogado,
                    dataHora,
                    dto.getSistolica(),
                    dto.getDiastolica(),
                    dto.getPulsacao(),
                    dto.getContexto()
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
            return ResponseEntity.ok(repository.findByUsuarioOrderByDataHoraDesc(usuarioLogado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar medições: " + e.getMessage());
        }
    }
}
