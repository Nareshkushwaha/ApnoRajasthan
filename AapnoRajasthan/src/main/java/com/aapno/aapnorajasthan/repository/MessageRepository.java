package com.aapno.aapnorajasthan.repository;

import com.aapno.aapnorajasthan.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
}