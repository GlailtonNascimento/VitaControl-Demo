package com.vitacontrol.demo.repository;

import com.vitacontrol.demo.model.MedicaoPressao;
import com.vitacontrol.demo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface MedicaoPressaoRepository extends JpaRepository<MedicaoPressao, UUID> {
    
    // Filtro estrito por usuário para garantir o isolamento total de escopo
    List<MedicaoPressao> findByUsuarioOrderByDataHoraDesc(Usuario usuario);
}
