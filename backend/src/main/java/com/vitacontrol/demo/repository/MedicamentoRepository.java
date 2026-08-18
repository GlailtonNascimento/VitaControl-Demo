package com.vitacontrol.demo.repository;

import com.vitacontrol.demo.model.Medicamento;
import com.vitacontrol.demo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicamentoRepository extends JpaRepository<Medicamento, Long> {
    List<Medicamento> findByUsuarioOrderByHorarioAsc(Usuario usuario);
}
