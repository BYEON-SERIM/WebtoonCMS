package com.example.cms.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor  
@AllArgsConstructor 
@Builder            
public class CommonCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String groupCode;
    private String codeValue;
    private String codeName;
    private String attr1;

    @Builder.Default
    private String useYn = "Y";
}