package com.example.cms.repository;

import com.example.cms.domain.WebtoonLog;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cms.domain.CommonCode;

public interface CommonCodeRepository extends JpaRepository<CommonCode, Long> {
	List<CommonCode> findByGroupCodeAndUseYn(String groupCode, String useYn);

}