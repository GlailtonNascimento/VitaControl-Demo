package com.vitacontrol.demo.repository;

import com.vitacontrol.demo.model.MedicaoPressao;
import com.vitacontrol.demo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicaoPressaoRepository extends JpaRepository<MedicaoPressao, Long> {
    
    // Atende o MedicaoPressaoController
    List<MedicaoPressao> findByUsuario(Usuario usuario);
    
    // Atende o MedicaoController
    List<MedicaoPressao> findByUsuarioOrderByDataHoraDesc(Usuario usuario);
}
