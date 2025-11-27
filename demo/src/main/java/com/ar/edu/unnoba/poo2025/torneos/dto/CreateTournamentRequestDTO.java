package com.ar.edu.unnoba.poo2025.torneos.dto;

import java.time.LocalDate;

public class CreateTournamentRequestDTO {
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate finishDate;

    public CreateTournamentRequestDTO() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getFinishDate() { return finishDate; }
    public void setFinishDate(LocalDate finishDate) { this.finishDate = finishDate; }
}
