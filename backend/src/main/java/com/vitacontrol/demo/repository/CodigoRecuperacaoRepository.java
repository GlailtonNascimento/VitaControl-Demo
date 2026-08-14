package com.vitacontrol.demo.repository;

import com.vitacontrol.demo.model.CodigoRecuperacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CodigoRecuperacaoRepository extends JpaRepository<CodigoRecuperacao, Long> {
    Optional<CodigoRecuperacao> findByEmailAndCodigoAndUsadoFalse(String email, String codigo);
    void deleteByEmail(String email);
}
