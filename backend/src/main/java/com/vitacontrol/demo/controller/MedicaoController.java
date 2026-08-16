package com.vitacontrol.demo.controller;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import com.vitacontrol.demo.dto.DashboardResponseDTO;
import com.vitacontrol.demo.dto.MedicaoRequestDTO;
import com.vitacontrol.demo.model.MedicaoPressao;
import com.vitacontrol.demo.model.Usuario;
import com.vitacontrol.demo.repository.MedicaoPressaoRepository;
import com.vitacontrol.demo.repository.UsuarioRepository;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:4200")
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

    // ==================== SALVAR MEDIÇÃO ====================
    @PostMapping("/medicoes")
    public ResponseEntity<?> salvar(@Valid @RequestBody MedicaoRequestDTO dto) {
        try {
            Usuario usuarioLogado = getUsuarioAutenticado();
            LocalDateTime dataHora = LocalDateTime.now(ZoneId.of("America/Sao_Paulo"));
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

    // ==================== LISTAR MEDIÇÕES ====================
    @GetMapping("/medicoes")
    public ResponseEntity<?> listarTodas() {
        try {
            Usuario usuarioLogado = getUsuarioAutenticado();
            List<MedicaoPressao> medicoes = repository.findByUsuarioOrderByDataHoraDesc(usuarioLogado);
            return ResponseEntity.ok(medicoes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar medições: " + e.getMessage());
        }
    }

    // ==================== DASHBOARD ====================
    @GetMapping("/medicoes/dashboard")
    public ResponseEntity<?> obterDashboard() {
        try {
            Usuario usuarioLogado = getUsuarioAutenticado();
            List<MedicaoPressao> medicoes = repository.findByUsuarioOrderByDataHoraDesc(usuarioLogado);

            if (medicoes.isEmpty()) {
                return ResponseEntity.ok(new DashboardResponseDTO(0, 0, 0, 0, "Sem medições registradas"));
            }

            long total = medicoes.size();
            double mediaSis = medicoes.stream().mapToInt(MedicaoPressao::getSistolica).average().orElse(0.0);
            double mediaDia = medicoes.stream().mapToInt(MedicaoPressao::getDiastolica).average().orElse(0.0);
            double mediaPul = medicoes.stream().mapToInt(MedicaoPressao::getPulsacao).average().orElse(0.0);

            String statusGeral;
            if (mediaSis >= 140 || mediaDia >= 90) {
                statusGeral = "Hipertensão";
            } else if (mediaSis >= 120 || mediaDia >= 80) {
                statusGeral = "Pré-hipertensão";
            } else {
                statusGeral = "Normal";
            }

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

    // ==================== GRÁFICOS ====================

    @GetMapping("/medicoes/grafico/semanal")
    public ResponseEntity<?> getGraficoSemanal() {
        try {
            Usuario usuarioLogado = getUsuarioAutenticado();
            List<MedicaoPressao> medicoes = repository.findByUsuarioOrderByDataHoraDesc(usuarioLogado);

            LocalDateTime umaSemanaAtras = LocalDateTime.now(ZoneId.of("America/Sao_Paulo")).minusDays(7);
            List<MedicaoPressao> semana = medicoes.stream()
                    .filter(m -> m.getDataHora().isAfter(umaSemanaAtras))
                    .toList();

            Map<String, Object> resultado = new LinkedHashMap<>();
            resultado.put("labels", semana.stream().map(m -> m.getDataHora().toLocalDate().toString()).toList());
            resultado.put("sistolica", semana.stream().map(MedicaoPressao::getSistolica).toList());
            resultado.put("diastolica", semana.stream().map(MedicaoPressao::getDiastolica).toList());

            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao gerar gráfico semanal: " + e.getMessage());
        }
    }

    @GetMapping("/medicoes/grafico/mensal")
    public ResponseEntity<?> getGraficoMensal() {
        try {
            Usuario usuarioLogado = getUsuarioAutenticado();
            List<MedicaoPressao> medicoes = repository.findByUsuarioOrderByDataHoraDesc(usuarioLogado);

            LocalDateTime umMesAtras = LocalDateTime.now(ZoneId.of("America/Sao_Paulo")).minusDays(30);
            List<MedicaoPressao> mes = medicoes.stream()
                    .filter(m -> m.getDataHora().isAfter(umMesAtras))
                    .toList();

            Map<String, Object> resultado = new LinkedHashMap<>();
            resultado.put("labels", mes.stream().map(m -> m.getDataHora().toLocalDate().toString()).toList());
            resultado.put("sistolica", mes.stream().map(MedicaoPressao::getSistolica).toList());
            resultado.put("diastolica", mes.stream().map(MedicaoPressao::getDiastolica).toList());

            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao gerar gráfico mensal: " + e.getMessage());
        }
    }

    @GetMapping("/medicoes/grafico/anual")
    public ResponseEntity<?> getGraficoAnual() {
        try {
            Usuario usuarioLogado = getUsuarioAutenticado();
            List<MedicaoPressao> medicoes = repository.findByUsuarioOrderByDataHoraDesc(usuarioLogado);

            LocalDateTime umAnoAtras = LocalDateTime.now(ZoneId.of("America/Sao_Paulo")).minusDays(365);
            List<MedicaoPressao> ano = medicoes.stream()
                    .filter(m -> m.getDataHora().isAfter(umAnoAtras))
                    .toList();

            Map<String, Object> resultado = new LinkedHashMap<>();
            resultado.put("labels", ano.stream().map(m -> m.getDataHora().toLocalDate().toString()).toList());
            resultado.put("sistolica", ano.stream().map(MedicaoPressao::getSistolica).toList());
            resultado.put("diastolica", ano.stream().map(MedicaoPressao::getDiastolica).toList());

            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao gerar gráfico anual: " + e.getMessage());
        }
    }
}
