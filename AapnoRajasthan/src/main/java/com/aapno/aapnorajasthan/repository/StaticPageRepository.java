package com.aapno.aapnorajasthan.repository;

import com.aapno.aapnorajasthan.entity.StaticPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaticPageRepository extends JpaRepository<StaticPage, Long> {
}