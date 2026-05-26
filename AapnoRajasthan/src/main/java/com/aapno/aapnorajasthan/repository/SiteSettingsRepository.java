package com.aapno.aapnorajasthan.repository;

import com.aapno.aapnorajasthan.entity.SiteSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SiteSettingsRepository extends JpaRepository<SiteSettings, Long> {
}