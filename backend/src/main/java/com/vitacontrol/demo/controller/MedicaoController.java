package com.vitacontrol.demo.controller;

import com.vitacontrol.demo.dto.MedicaoRequestDTO;
import com.vitacontrol.demo.dto.DashboardResponseDTO;
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
import java.util.List;

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

    @GetMapping("/medicoes/dashboard")
    public ResponseEntity<?> obterDashboard() {
        try {
            Usuario usuarioLogado = getUsuarioAutenticado();
            List<MedicaoPressao> medicoes = repository.findByUsuarioOrderByDataHoraDesc(usuarioLogado);

            if (medicoes.isEmpty()) {
                return ResponseEntity.ok(new DashboardResponseDTO(0, 0, 0, 0, "Sem medições registradas"));
            }

            long total = medicoes.size();
            
            // Calcula as médias aritméticas
            double mediaSis = medicoes.stream().mapToInt(MedicaoPressao::getSistolica).average().orElse(0.0);
            double mediaDia = medicoes.stream().mapToInt(MedicaoPressao::getDiastolica).average().orElse(0.0);
            double mediaPul = medicoes.stream().mapToInt(MedicaoPressao::getPulsacao).average().orElse(0.0);

            // Aplica a Regra de Negócio de Saúde baseado nas médias
            String statusGeral;
            if (mediaSis >= 140 || mediaDia >= 90) {
                statusGeral = "Hipertensão";
            } else if (mediaSis >= 120 || mediaDia >= 80) {
                statusGeral = "Pré-hipertensão";
            } else {
                statusGeral = "Normal";
            }

            // Retorna o DTO estruturado e arredondado
            DashboardResponseDTO dashboard = new DashboardResponseDTO(
                    total,
                    Math.round(mediaSis * 10.0) / 10.0,
                    Math.round(mediaDia * 10.0) / 10.0,
                    Math.round(mediaPul * 10.0) / 10.0,
                    statusGeral
            );

            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao gerar dashboard: " + e.getMessage());
        }
    }
}
