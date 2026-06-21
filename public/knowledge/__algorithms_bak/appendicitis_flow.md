# Алгоритм: подозрение на аппендицит

```mermaid
flowchart TD
  A[Patient: abdominal pain] --> B{Localization}
  B -->|Right iliac fossa| C[Exam: McBurney / Rovsing / Obturator]
  B -->|Diffuse / periumbilical| D[Re-examine in 4-6 h]
  C --> E{Signs present?}
  E -->|No| D
  E -->|Yes| F[Labs: CBC + CRP + Urinalysis]
  F --> G{Alvarado ≥ 7 + labs?}
  G -->|Low suspicion| D
  G -->|High suspicion| H[CT or US if equivocal]
  H --> I[Laparoscopic appendicectomy]
  I --> J{Findings}
  J -->|Simple| K[Standard closure]
  J -->|Gangrene / Perforation| L[Lavage + drain ± antibiotics]
  D --> M{Improvement?}
  M -->|Yes| N[Observation]
  M -->|No / worsening| O[Emergency consult]
```

## Пояснения

- При неясной картине допустимо динамическое наблюдение 4–6 часов с повторным осмотром.
- Гиперлейкозитоз + нейтрофилез повышают вероятность хирургической патологии.
