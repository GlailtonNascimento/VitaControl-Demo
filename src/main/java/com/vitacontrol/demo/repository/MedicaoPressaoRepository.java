package com.vitacontrol.demo.repository;

import com.vitacontrol.demo.model.MedicaoPressao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicaoPressaoRepository extends JpaRepository<MedicaoPressao, Long> {
    List<MedicaoPressao> findAllByOrderByDataHoraDesc();
}

