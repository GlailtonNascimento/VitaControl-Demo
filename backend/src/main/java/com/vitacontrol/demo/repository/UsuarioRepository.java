package com.vitacontrol.demo.repository;

import com.vitacontrol.demo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Método essencial para encontrar o usuário durante a autenticação
    Optional<Usuario> findByUsername(String username);
}
