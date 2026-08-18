package com.vitacontrol.demo.repository;

import com.vitacontrol.demo.model.MedicaoPressao;
import com.vitacontrol.demo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface MedicaoPressaoRepository extends JpaRepository<MedicaoPressao, Long> {
    List<MedicaoPressao> findByUsuarioOrderByDataHoraDesc(Usuario usuario);
    List<MedicaoPressao> findByUsuarioAndDataHoraBetweenOrderByDataHoraDesc(Usuario usuario, LocalDateTime inicio, LocalDateTime fim);
}
