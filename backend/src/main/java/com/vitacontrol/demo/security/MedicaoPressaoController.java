package com.vitacontrol.demo.security;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.vitacontrol.demo.model.MedicaoPressao;
import com.vitacontrol.demo.model.Usuario;
import com.vitacontrol.demo.repository.MedicaoPressaoRepository;
import com.vitacontrol.demo.repository.UsuarioRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200") // Comunicação direta com o Angular
public class MedicaoPressaoController {

    private final MedicaoPressaoRepository medicaoRepository;
    private final UsuarioRepository usuarioRepository;

    public MedicaoPressaoController(MedicaoPressaoRepository medicaoRepository, UsuarioRepository usuarioRepository) {
        this.medicaoRepository = medicaoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // 📥 GET /api/medicoes - Retorna apenas as medições do usuário logado
    @GetMapping("/medicoes")
    public ResponseEntity<?> listarMinhasMedicoes(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("mensagem", "Acesso não autorizado."));
        }
        
        // Busca o usuário no banco pelo username extraído do Token JWT
        Usuario usuario = usuarioRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Retorna a lista de registros vinculados a este usuário específico
        List<MedicaoPressao> medicoes = medicaoRepository.findByUsuario(usuario);
        return ResponseEntity.ok(medicoes);
    }

    // 📤 POST /api/medicao - Salva uma nova medição vinculada ao usuário logado
    @PostMapping("/medicao")
    public ResponseEntity<?> salvarMedicao(@AuthenticationPrincipal UserDetails userDetails, 
                                           @RequestBody MedicaoPressao novaMedicao) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("mensagem", "Acesso não autorizado."));
        }

        Usuario usuario = usuarioRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Associa o usuário dono do token à nova medição antes de persistir
        novaMedicao.setUsuario(usuario);
        
        // Garante que a data/hora seja registrada no momento exato do clique caso venha em branco
        if (novaMedicao.getDataHora() == null) {
            novaMedicao.setDataHora(java.time.LocalDateTime.now());
        }

        MedicaoPressao salva = medicaoRepository.save(novaMedicao);
        return ResponseEntity.ok(salva);
    }
}

