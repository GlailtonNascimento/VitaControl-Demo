package com.vitacontrol.demo.repository;

import com.vitacontrol.demo.model.TokenRecuperacaoSenha;
import com.vitacontrol.demo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRecuperacaoSenhaRepository extends JpaRepository<TokenRecuperacaoSenha, Long> {
    
    // Busca o registro completo pelo token gerado
    Optional<TokenRecuperacaoSenha> findByToken(String token);
    
    // Caso queira limpar tokens antigos de um usuário específico
    void deleteByUsuario(Usuario usuario);
}

