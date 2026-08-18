import type { SubjectName } from '../types/student';

export interface PracticeQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number; // 0 for A, 1 for B, 2 for C, 3 for D
  correctOptionLetter: 'A' | 'B' | 'C' | 'D';
  hint: string;
  formula?: string;
  aiExplanation: string;
}

export interface PracticeTopicPack {
  topicId: string;
  topicName: string;
  subject: SubjectName;
  description: string;
  targetXp: number;
  timeLimitSeconds: number;
  questions: PracticeQuestion[];
}

export const PRACTICE_TOPIC_PACKS: Record<string, PracticeTopicPack> = {
  'topic-rotational-friction': {
    topicId: 'topic-rotational-friction',
    topicName: 'Rotational Kinematics & Static Friction Torque',
    subject: 'Physics',
    description: 'Master angular acceleration equations, static friction direction during pure rolling, and torque sign conventions.',
    targetXp: 150,
    timeLimitSeconds: 600,
    questions: [
      {
        id: 'rf-q1',
        questionNumber: 1,
        questionText: 'A solid cylinder of mass M and radius R rolls without slipping down an inclined plane of inclination θ. What is the magnitude and direction of the static friction force acting on the cylinder?',
        options: [
          'f = (1/3) Mg sin θ directed up the incline',
          'f = (1/2) Mg sin θ directed down the incline',
          'f = (2/3) Mg sin θ directed up the incline',
          'f = Mg sin θ directed up the incline',
        ],
        correctOptionIndex: 0,
        correctOptionLetter: 'A',
        hint: 'Apply Newton second law along the incline: Mg sin θ - f = M a, and torque about center of mass: f R = I α with a = R α and I = (1/2) M R².',
        formula: 'f = (I_cm / (I_cm + M R²)) Mg sin θ = (1/3) Mg sin θ',
        aiExplanation: 'For a solid cylinder rolling down an incline without slipping, I_cm = (1/2) M R². Torque equation about the center of mass gives f R = (1/2) M R² (a / R) ⇒ f = (1/2) M a. Substituting into translational equation Mg sin θ - f = M a yields a = (2/3) g sin θ, and static friction f = (1/3) Mg sin θ acting upwards to oppose sliding.',
      },
      {
        id: 'rf-q2',
        questionNumber: 2,
        questionText: 'A wheel of radius 0.5 m accelerates uniformly from rest to an angular speed of 20 rad/s in 4 seconds. What is the linear tangential acceleration of a point on its outer rim?',
        options: [
          '1.5 m/s²',
          '2.5 m/s²',
          '5.0 m/s²',
          '10.0 m/s²',
        ],
        correctOptionIndex: 1,
        correctOptionLetter: 'B',
        hint: 'First calculate angular acceleration α = (ω - ω₀) / t, then use a_t = r α.',
        formula: 'a_t = R α = R (Δω / Δt)',
        aiExplanation: 'Angular acceleration α = (20 - 0) / 4 = 5 rad/s². Tangential acceleration a_t = R × α = 0.5 m × 5 rad/s² = 2.5 m/s².',
      },
      {
        id: 'rf-q3',
        questionNumber: 3,
        questionText: 'A thin uniform rod of length L and mass M is hinged at one end and released from a horizontal position. What is the angular acceleration α of the rod at the instant of release?',
        options: [
          'α = 3g / (2L)',
          'α = g / L',
          'α = 2g / (3L)',
          'α = 3g / L',
        ],
        correctOptionIndex: 0,
        correctOptionLetter: 'A',
        hint: 'Torque about the hinge is τ = Mg (L/2). Moment of inertia about the end hinge is I = (1/3) M L².',
        formula: 'τ = I α ⇒ Mg (L/2) = (1/3 M L²) α',
        aiExplanation: 'The center of mass is at distance L/2 from the hinge, so torque τ = Mg (L/2). Moment of inertia of a rod about its end is I = (1/3) M L². Thus, α = τ / I = (Mg L / 2) / (1/3 M L²) = 3g / (2L).',
      },
      {
        id: 'rf-q4',
        questionNumber: 4,
        questionText: 'For a rigid body undergoing pure rolling on a stationary horizontal floor with a constant linear velocity v, what is the instantaneous velocity of the point of contact with the ground?',
        options: [
          'v',
          '2v',
          '0',
          'v / 2',
        ],
        correctOptionIndex: 2,
        correctOptionLetter: 'C',
        hint: 'In pure rolling, the instantaneous velocity of the contact point is v_contact = v_cm - ω R = 0.',
        formula: 'v_contact = v_cm - ω R = 0',
        aiExplanation: 'In pure rolling without slipping on a stationary surface, the translational velocity v_cm is equal to ω R. At the lowest contact point, translational velocity forward (+v) and rotational velocity backward (-ω R) cancel out exactly, making the instantaneous contact velocity 0.',
      },
      {
        id: 'rf-q5',
        questionNumber: 5,
        questionText: 'A disc and a ring of equal mass M and radius R are released simultaneously from the top of the same rough incline. Which object reaches the bottom first?',
        options: [
          'The ring reaches first because it has greater moment of inertia',
          'The disc reaches first because it has smaller moment of inertia',
          'Both reach simultaneously because mass and radius are identical',
          'Cannot be determined without knowing the coefficient of friction',
        ],
        correctOptionIndex: 1,
        correctOptionLetter: 'B',
        hint: 'Acceleration in pure rolling is a = g sin θ / (1 + I_cm / M R²). Smaller I_cm means larger acceleration.',
        formula: 'a = g sin θ / (1 + k² / R²)',
        aiExplanation: 'The acceleration down an incline for pure rolling is a = g sin θ / (1 + I_cm / M R²). For the disc, I_cm / M R² = 0.5 (so a = 2/3 g sin θ ≈ 0.67 g sin θ). For the ring, I_cm / M R² = 1.0 (so a = 1/2 g sin θ = 0.50 g sin θ). The disc has higher acceleration and reaches the bottom first.',
      },
    ],
  },
  'topic-le-chatelier-inert': {
    topicId: 'topic-le-chatelier-inert',
    topicName: "Le Chatelier's Principle & Inert Gas Addition",
    subject: 'Chemistry',
    description: 'Master equilibrium shifts upon inert gas addition at constant pressure vs constant volume.',
    targetXp: 150,
    timeLimitSeconds: 600,
    questions: [
      {
        id: 'lc-q1',
        questionNumber: 1,
        questionText: 'For the equilibrium reaction PCl₅(g) ⇌ PCl₃(g) + Cl₂(g), what happens to the equilibrium position when an inert gas (like Helium) is added at CONSTANT VOLUME?',
        options: [
          'Equilibrium shifts forward (towards products)',
          'Equilibrium shifts backward (towards reactants)',
          'Equilibrium remains completely unaffected',
          'Equilibrium constant K_p increases',
        ],
        correctOptionIndex: 2,
        correctOptionLetter: 'C',
        hint: 'At constant volume, the partial pressures and molar concentrations of reacting gases do not change.',
        formula: 'P_i = (n_i / V) R T = constant at constant V',
        aiExplanation: 'When an inert gas is added at constant volume, total pressure increases, but the volume V remains constant. Thus, the partial pressure (P_i = n_i R T / V) and concentration of each reactant/product remains unchanged. Hence, there is no shift in equilibrium.',
      },
      {
        id: 'lc-q2',
        questionNumber: 2,
        questionText: 'For the same reaction PCl₅(g) ⇌ PCl₃(g) + Cl₂(g), what happens when an inert gas is added at CONSTANT PRESSURE?',
        options: [
          'Shifts in the forward direction (towards more moles of gas)',
          'Shifts in the backward direction (towards fewer moles of gas)',
          'No change in equilibrium position',
          'Dissociation degree α decreases',
        ],
        correctOptionIndex: 0,
        correctOptionLetter: 'A',
        hint: 'At constant pressure, adding gas forces volume V to expand, diluting partial pressures.',
        formula: 'Δn_g = (1 + 1) - 1 = +1 > 0',
        aiExplanation: 'At constant pressure, adding an inert gas increases total moles, requiring the container volume to increase. This dilution decreases the partial pressure of each reactant and product. According to Le Chatelier principle, equilibrium shifts in the direction that produces MORE gaseous moles (Δn_g > 0), which is forward.',
      },
      {
        id: 'lc-q3',
        questionNumber: 3,
        questionText: 'For the Haber process N₂(g) + 3H₂(g) ⇌ 2NH₃(g) (ΔH = -92 kJ/mol), which set of conditions favors the maximum yield of ammonia?',
        options: [
          'High temperature and Low pressure',
          'Low temperature and High pressure',
          'High temperature and High pressure',
          'Low temperature and Low pressure',
        ],
        correctOptionIndex: 1,
        correctOptionLetter: 'B',
        hint: 'The reaction is exothermic (ΔH < 0) and results in a decrease in gaseous moles (Δn_g = 2 - 4 = -2).',
        formula: 'Exothermic: T ↓ ⇒ Forward; Δn_g < 0: P ↑ ⇒ Forward',
        aiExplanation: 'Since the reaction is exothermic (ΔH < 0), lowering temperature shifts equilibrium in the forward direction. Since Δn_g = 2 - 4 = -2 (moles decrease), increasing pressure shifts the reaction toward fewer moles (forward). Therefore, low temperature and high pressure maximize ammonia yield.',
      },
      {
        id: 'lc-q4',
        questionNumber: 4,
        questionText: 'How does the numerical value of the equilibrium constant K_c change when a catalyst is added to a reversible reaction?',
        options: [
          'K_c increases because forward reaction rate is accelerated',
          'K_c decreases because activation energy of reverse reaction drops',
          'K_c remains unchanged because catalyst speeds up forward and reverse rates equally',
          'K_c doubles in presence of platinum catalyst',
        ],
        correctOptionIndex: 2,
        correctOptionLetter: 'C',
        hint: 'A catalyst lowers activation energy for both forward and reverse pathways by the exact same amount.',
        formula: 'K_c = k_f / k_b = constant at fixed T',
        aiExplanation: 'A catalyst accelerates both the forward rate constant (k_f) and backward rate constant (k_b) by the exact same factor by offering an alternate lower-energy pathway. Thus, K_c = k_f / k_b remains unchanged; only the time required to attain equilibrium decreases.',
      },
      {
        id: 'lc-q5',
        questionNumber: 5,
        questionText: 'For the reaction H₂(g) + I₂(g) ⇌ 2HI(g), what is the effect of adding an inert gas at CONSTANT PRESSURE?',
        options: [
          'Shifts forward',
          'Shifts backward',
          'No shift because Δn_g = 0',
          'HI decomposes spontaneously',
        ],
        correctOptionIndex: 2,
        correctOptionLetter: 'C',
        hint: 'Check Δn_g = (moles of gaseous products) - (moles of gaseous reactants).',
        formula: 'Δn_g = 2 - (1 + 1) = 0',
        aiExplanation: 'Here Δn_g = 2 - 2 = 0. Even though volume increases upon adding an inert gas at constant pressure, the ratio of moles in the reaction quotient Q_p remains unchanged because the volume factor cancels out when Δn_g = 0. Hence, there is no shift in equilibrium.',
      },
    ],
  },
  'topic-definite-integral-kings': {
    topicId: 'topic-definite-integral-kings',
    topicName: "Definite Integrals & King's Property",
    subject: 'Biology',
    description: "Master evaluation of trigonometric and algebraic definite integrals using King's Property ∫ f(x) dx = ∫ f(a+b-x) dx.",
    targetXp: 150,
    timeLimitSeconds: 600,
    questions: [
      {
        id: 'di-q1',
        questionNumber: 1,
        questionText: 'Evaluate the definite integral I = ∫₀^(π/2) (sin³ x) / (sin³ x + cos³ x) dx.',
        options: [
          'π / 2',
          'π / 4',
          'π / 8',
          '1',
        ],
        correctOptionIndex: 1,
        correctOptionLetter: 'B',
        hint: "Apply King's Property: I = ∫₀^(π/2) f(π/2 - x) dx, then add 2I = ∫₀^(π/2) 1 dx.",
        formula: '∫_a^b f(x) dx = ∫_a^b f(a + b - x) dx',
        aiExplanation: "Using King's property: I = ∫₀^(π/2) cos³ x / (cos³ x + sin³ x) dx. Adding both equations gives 2I = ∫₀^(π/2) (sin³ x + cos³ x)/(sin³ x + cos³ x) dx = ∫₀^(π/2) 1 dx = π/2. Therefore, I = π/4.",
      },
      {
        id: 'di-q2',
        questionNumber: 2,
        questionText: 'Evaluate I = ∫₂⁴ (√x) / (√(6 - x) + √x) dx.',
        options: [
          '1',
          '2',
          '3',
          '4',
        ],
        correctOptionIndex: 0,
        correctOptionLetter: 'A',
        hint: 'Apply King property with a = 2 and b = 4, so x is replaced by 2 + 4 - x = 6 - x.',
        formula: '2I = ∫_a^b 1 dx = b - a',
        aiExplanation: "By King's property, replacing x with (2 + 4 - x) = (6 - x) yields I = ∫₂⁴ √(6-x) / (√x + √(6-x)) dx. Adding the original integral gives 2I = ∫₂⁴ 1 dx = 4 - 2 = 2 ⇒ I = 1.",
      },
      {
        id: 'di-q3',
        questionNumber: 3,
        questionText: 'Evaluate I = ∫₀^(π) (x sin x) / (1 + cos² x) dx.',
        options: [
          'π² / 2',
          'π² / 4',
          'π / 4',
          'π²',
        ],
        correctOptionIndex: 1,
        correctOptionLetter: 'B',
        hint: "Replace x with π - x. The x in the numerator cancels upon adding 2I.",
        formula: '2I = π ∫₀^π (sin x) / (1 + cos² x) dx',
        aiExplanation: "By King's property, I = ∫₀^π ((π - x) sin x) / (1 + cos² x) dx. Adding gives 2I = π ∫₀^π (sin x) / (1 + cos² x) dx. Putting cos x = t (dt = -sin x dx), 2I = π ∫₋₁¹ 1 / (1 + t²) dt = π [arctan t]₋₁¹ = π (π/4 - (-π/4)) = π²/2 ⇒ I = π²/4.",
      },
      {
        id: 'di-q4',
        questionNumber: 4,
        questionText: 'What is the value of ∫₀^(π/2) ln(tan x) dx?',
        options: [
          '0',
          'π / 2',
          '-π ln 2',
          '1',
        ],
        correctOptionIndex: 0,
        correctOptionLetter: 'A',
        hint: 'Use tan(π/2 - x) = cot x = 1 / tan x, and ln(cot x) = -ln(tan x).',
        formula: 'ln(tan(π/2 - x)) = ln(cot x) = -ln(tan x)',
        aiExplanation: "Applying King's property: I = ∫₀^(π/2) ln(cot x) dx = ∫₀^(π/2) (-ln(tan x)) dx = -I. Thus 2I = 0 ⇒ I = 0.",
      },
      {
        id: 'di-q5',
        questionNumber: 5,
        questionText: 'Evaluate I = ∫₋ₐᵃ (x³ + x cos x + tan⁵ x + 1) dx.',
        options: [
          '0',
          '2a',
          'a',
          '4a',
        ],
        correctOptionIndex: 1,
        correctOptionLetter: 'B',
        hint: 'Split the integral into odd and even functions. Integral of odd function over [-a, a] is 0.',
        formula: '∫₋ₐᵃ f_odd(x) dx = 0, ∫₋ₐᵃ 1 dx = 2a',
        aiExplanation: 'The functions x³, x cos x, and tan⁵ x are all odd functions (f(-x) = -f(x)). Their integrals over [-a, a] evaluate to 0. The only non-zero term is the constant 1 (even function), which gives ∫₋ₐᵃ 1 dx = a - (-a) = 2a.',
      },
    ],
  },
};

// Aliases for general topic IDs
PRACTICE_TOPIC_PACKS['topic-1'] = PRACTICE_TOPIC_PACKS['topic-rotational-friction'];
PRACTICE_TOPIC_PACKS['topic-2'] = PRACTICE_TOPIC_PACKS['topic-le-chatelier-inert'];
PRACTICE_TOPIC_PACKS['assign-01'] = PRACTICE_TOPIC_PACKS['topic-rotational-friction'];
PRACTICE_TOPIC_PACKS['assign-02'] = PRACTICE_TOPIC_PACKS['topic-le-chatelier-inert'];
PRACTICE_TOPIC_PACKS['assign-03'] = PRACTICE_TOPIC_PACKS['topic-definite-integral-kings'];
PRACTICE_TOPIC_PACKS['paper-02'] = PRACTICE_TOPIC_PACKS['topic-rotational-friction'];
PRACTICE_TOPIC_PACKS['paper-03'] = PRACTICE_TOPIC_PACKS['topic-le-chatelier-inert'];
PRACTICE_TOPIC_PACKS['paper-04'] = PRACTICE_TOPIC_PACKS['topic-definite-integral-kings'];

export function getPracticeTopicPack(topicId?: string): PracticeTopicPack {
  if (topicId && PRACTICE_TOPIC_PACKS[topicId]) {
    return PRACTICE_TOPIC_PACKS[topicId];
  }
  return PRACTICE_TOPIC_PACKS['topic-rotational-friction'];
}
