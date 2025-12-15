import React from "react";
import styles from "./styles.module.scss";

interface BreedWeight {
  imperial: string;
  metric: string;
}

interface BreedData {
  weight: BreedWeight;
  id: string;
  name: string;
  cfa_url?: string;
  vetstreet_url?: string;
  vcahospitals_url?: string;
  temperament: string;
  origin: string;
  country_codes: string;
  country_code: string;
  description: string;
  life_span: string;
  indoor: number;
  lap: number;
  alt_names?: string;
  adaptability: number;
  affection_level: number;
  child_friendly: number;
  dog_friendly: number;
  energy_level: number;
  grooming: number;
  health_issues: number;
  intelligence: number;
  shedding_level: number;
  social_needs: number;
  stranger_friendly: number;
  vocalisation: number;
  experimental: number;
  hairless: number;
  natural: number;
  rare: number;
  rex: number;
  suppressed_tail: number;
  short_legs: number;
  wikipedia_url?: string;
  hypoallergenic: number;
  reference_image_id: string;
}

interface CatData {
  id: string;
  url: string;
  breeds: BreedData[];
  width: number;
  height: number;
}

export interface BreedCardProps {
  data: CatData;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact" | "detailed";
  showImage?: boolean;
  showStats?: boolean;
  maxTraits?: number;
}

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, maxValue = 5 }) => {
  return (
    <div className={styles.statBar}>
      <span className={styles.statLabel}>{label}</span>
      <div className={styles.statTrack}>
        <div
          className={styles.statFill}
          style={{ width: `${(value / maxValue) * 100}%` }}
        />
      </div>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
};

const BreedCard: React.FC<BreedCardProps> = ({
  data,
  size = "md",
  variant = "default",
  showImage = true,
  showStats = true,
  maxTraits = 6,
}) => {
  const breed = data.breeds[0];
  if (!breed) return null;

  const temperamentList = breed.temperament.split(", ").slice(0, maxTraits);

  const stats = [
    { label: "Adaptability", value: breed.adaptability },
    { label: "Affection", value: breed.affection_level },
    { label: "Energy", value: breed.energy_level },
    { label: "Intelligence", value: breed.intelligence },
    { label: "Social Needs", value: breed.social_needs },
    { label: "Grooming", value: breed.grooming },
  ];

  return (
    <div
      className={`${styles.breedCard} ${styles[size]} ${styles[variant]}`}
    >
      {showImage && (
        <div className={styles.imageContainer}>
          <img src={data.url} alt={breed.name} className={styles.image} />
          <div className={styles.imageOverlay}>
            <span className={styles.origin}>{breed.origin}</span>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{breed.name}</h3>
          <div className={styles.meta}>
            <span className={styles.lifespan}>🕐 {breed.life_span} years</span>
            <span className={styles.weight}>⚖️ {breed.weight.metric} kg</span>
          </div>
        </div>

        {variant !== "compact" && (
          <p className={styles.description}>{breed.description}</p>
        )}

        <div className={styles.traits}>
          {temperamentList.map((trait, index) => (
            <span key={index} className={styles.trait}>
              {trait}
            </span>
          ))}
        </div>

        {showStats && variant === "detailed" && (
          <div className={styles.stats}>
            {stats.map((stat) => (
              <StatBar key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        )}

        {breed.wikipedia_url && (
          <a
            href={breed.wikipedia_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Learn more →
          </a>
        )}
      </div>
    </div>
  );
};

export default BreedCard;
