package com.vitacontrol.demo.controller;

import com.vitacontrol.demo.model.Medicamento;
import com.vitacontrol.demo.model.Usuario;
import com.vitacontrol.demo.repository.MedicamentoRepository;
import com.vitacontrol.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicamentos")
@CrossOrigin(origins = "http://localhost:4200")
public class MedicamentoController {

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario getUsuarioAutenticado() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Map<String, String> body) {
        try {
            Usuario usuario = getUsuarioAutenticado();
            String nome = body.get("nome");
            String dosagem = body.get("dosagem");
            String horario = body.get("horario");
            Integer frequenciaDias = body.get("frequenciaDias") != null ? Integer.parseInt(body.get("frequenciaDias")) : 1;

            Medicamento medicamento = new Medicamento(usuario, nome, dosagem, horario, frequenciaDias);
            medicamentoRepository.save(medicamento);
            return ResponseEntity.status(HttpStatus.CREATED).body(medicamento);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao salvar: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        try {
            Usuario usuario = getUsuarioAutenticado();
            List<Medicamento> medicamentos = medicamentoRepository.findByUsuarioOrderByHorarioAsc(usuario);
            return ResponseEntity.ok(medicamentos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao listar: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            medicamentoRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("mensagem", "Medicamento removido com sucesso."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao deletar: " + e.getMessage());
        }
    }
}
