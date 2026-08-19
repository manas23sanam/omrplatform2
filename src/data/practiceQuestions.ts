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

export interface PracticeTopicTheory {
  title: string;
  summary: string;
  paragraphs: string[];
  keyTakeaways: string[];
  formula?: string;
}

export interface PracticeTopicPack {
  topicId: string;
  topicName: string;
  subject: SubjectName;
  description: string;
  targetXp: number;
  timeLimitSeconds: number;
  theory: PracticeTopicTheory;
  questions: PracticeQuestion[];
}

export const PRACTICE_TOPIC_PACKS: Record<string, PracticeTopicPack> = {
  'wt-1': {
    topicId: 'wt-1',
    topicName: 'Rotational Kinematics & Static Friction Torque',
    subject: 'Physics',
    description: 'Master rotational equilibrium conditions, static friction during pure rolling, torque sign conventions, and angular momentum conservation.',
    targetXp: 150,
    timeLimitSeconds: 600,
    theory: {
      title: 'Rotational Equilibrium & Rigid Body Mechanics',
      summary: 'Comprehensive theory on translational and rotational equilibrium conditions, static friction on inclines, torque analysis, and rolling motion without slipping.',
      paragraphs: [
        'Rotational equilibrium is the mechanical condition wherein the vector sum of all external torques acting upon a rigid body about any arbitrary reference point or pivot axis is identically zero (Στ = 0). For complete static equilibrium, both translational equilibrium (ΣF = 0) and rotational equilibrium (Στ = 0) must be satisfied simultaneously. Unlike point particles where forces can be summed without consideration of spatial coordinates, rigid body mechanics requires evaluating the perpendicular lever arm for each applied force relative to the chosen fulcrum.',
        'When a rigid body undergoes rolling motion without slipping on an inclined plane of inclination angle θ, static friction acts at the instantaneous point of contact. Because pure rolling implies no relative slippage (v_contact = v_cm - ω R = 0), static friction does not dissipate mechanical energy into heat. Instead, it exerts a torque τ = f_s · R about the center of mass, converting translational kinetic energy into rotational kinetic energy and producing angular acceleration α = a_cm / R.',
        'The magnitude of static friction required to sustain pure rolling down an inclined plane is given by f_s = [I_cm / (I_cm + M R²)] M g sin θ, directed upwards along the plane to oppose sliding tendency. For a solid cylinder or disc with I_cm = (1/2) M R², the linear acceleration down the incline is a_cm = (2/3) g sin θ, and the static friction force is f_s = (1/3) M g sin θ. For a thin spherical shell or hoop, the larger moment of inertia demands greater friction torque, resulting in lower translational acceleration.',
        'In structural stability and tipping problems, rotational equilibrium dictates that the resultant normal reaction line of action must pass within the physical footprint of the body. When an applied lateral load shifts the line of action of the net normal force beyond the supporting perimeter, the body ceases to remain in rotational balance and experiences an overturning torque leading to angular acceleration about its outer pivot.'
      ],
      keyTakeaways: [
        'Translational Equilibrium: ΣF = 0; Rotational Equilibrium: Στ = 0 about any pivot axis.',
        'Pure rolling contact point has zero instantaneous velocity: v_contact = v_cm - ω R = 0.',
        'Static friction on an incline acts UP the incline with f_s = [I_cm / (I_cm + M R²)] M g sin θ.',
        'Acceleration down incline: a = g sin θ / (1 + I_cm / M R²).'
      ],
      formula: 'a_{cm} = \\frac{g \\sin \\theta}{1 + \\frac{I_{cm}}{MR^2}}, \\quad f_s = \\frac{I_{cm}}{I_{cm} + MR^2} Mg \\sin \\theta, \\quad \\sum \\vec{\\tau} = I \\vec{\\alpha} = 0'
    },
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
  'wt-2': {
    topicId: 'wt-2',
    topicName: 'Electrophilic Aromatic Substitution',
    subject: 'Chemistry',
    description: 'Master electrophilic aromatic substitution (EAS) mechanisms, arenium ion (sigma complex) resonance stabilization, and substituent directing effects.',
    targetXp: 150,
    timeLimitSeconds: 600,
    theory: {
      title: 'Electrophilic Aromatic Substitution (EAS) & Reaction Mechanisms',
      summary: 'In-depth exploration of aromatic resonance stability, generation of electrophiles, formation of Wheland intermediates, and activating vs deactivating directing groups.',
      paragraphs: [
        'Electrophilic Aromatic Substitution (EAS) represents the central reaction pathway by which aromatic hydrocarbons are functionalized without losing their fundamental aromatic character. Because benzene possesses a cyclic, planar delocalized sextet of 6 π-electrons satisfying Hückel 4n+2 rule with exceptional resonance stabilization energy (~152 kJ/mol), it strongly resists addition reactions that would permanently destroy aromaticity, undergoing substitution of a ring hydrogen atom instead.',
        'The universal EAS mechanism proceeds through a distinct two-step pathway. In the initial rate-determining step (RDS), the nucleophilic aromatic π-cloud attacks a generated strong electrophile (such as the nitronium ion NO₂⁺ in nitration, or a bromonium complex in halogenation), forming a positively charged cyclohexadienyl cation intermediate known as an arenium ion, sigma complex, or Wheland intermediate. In this intermediate, aromaticity is temporarily disrupted, and four π-electrons are delocalized across five sp² carbon atoms while the reacting carbon rehybridizes to sp³.',
        'In the second and rapid step of the reaction, a weak base in the reaction medium abstracts the proton from the tetrahedral sp³ carbon of the sigma complex. The electron pair from the cleaving C-H bond re-enters the carbocyclic ring, instantly restoring the intact 6-π aromatic resonance sextet and releasing the substituted aromatic product with high thermodynamic favorability.',
        'Substituent groups already present on the aromatic ring dictate both overall reaction kinetics and regiochemical orientation. Electron-donating groups with unshared electron pairs (such as -OH, -NH₂, -OCH₃) or alkyl groups via hyperconjugation activate the aromatic ring by stabilizing the positive charge of the arenium intermediate through resonance, directing incoming electrophiles to ortho and para positions. Conversely, electron-withdrawing groups (such as -NO₂, -CF₃, -CN, -SO₃H) deactivate the ring and direct substitution to the meta position where electrostatic repulsion is minimized.'
      ],
      keyTakeaways: [
        'EAS preserves aromatic resonance energy by substituting a ring proton rather than adding across double bonds.',
        'The rate-determining step forms the resonance-stabilized arenium ion (Wheland sigma complex).',
        'Fast proton abstraction from the sp³ carbon restores the complete 6 π-electron aromatic system.',
        'Activating groups (-OH, -NH₂, alkyl) are ortho/para directing; deactivating groups (-NO₂, -CF₃) are meta directing (except halogens which are deactivating but ortho/para directing).'
      ],
      formula: '\\text{Ar-H} + E^+ \\xrightarrow{\\text{Slow (RDS)}} [\\text{Ar}^+(H)(E)] \\xrightarrow{\\text{Fast, } B:} \\text{Ar-E} + HB^+'
    },
    questions: [
      {
        id: 'eas-q1',
        questionNumber: 1,
        questionText: 'In the nitration of benzene using a mixture of concentrated HNO₃ and concentrated H₂SO₄, what is the active electrophilic species?',
        options: [
          'NO₂⁺ (Nitronium ion)',
          'NO₃⁻ (Nitrate ion)',
          'NO⁺ (Nitrosonium ion)',
          'HNO₂ (Nitrous acid)',
        ],
        correctOptionIndex: 0,
        correctOptionLetter: 'A',
        hint: 'Sulfuric acid protonates nitric acid, causing water loss to generate a linear cation with +1 charge on nitrogen.',
        formula: 'HNO_3 + 2H_2SO_4 \\rightleftharpoons NO_2^+ + H_3O^+ + 2HSO_4^-',
        aiExplanation: 'Sulfuric acid acts as a stronger Bronsted acid, protonating nitric acid on the -OH group to form H₂O⁺-NO₂. Loss of water generates the linear nitronium ion (NO₂⁺), which serves as the powerful active electrophile attacked by the benzene π-cloud.',
      },
      {
        id: 'eas-q2',
        questionNumber: 2,
        questionText: 'Which of the following substituents on a benzene ring is strongly activating and ortho/para-directing in electrophilic aromatic substitution?',
        options: [
          '-NO₂',
          '-OH',
          '-CF₃',
          '-COOH',
        ],
        correctOptionIndex: 1,
        correctOptionLetter: 'B',
        hint: 'Look for the substituent with a lone pair on the atom directly attached to the ring that can donate electrons via resonance (+M effect).',
        formula: '+M \\text{ (Resonance Donation)} > -I \\text{ (Inductive Withdrawal)}',
        aiExplanation: 'The hydroxyl group (-OH) has lone pairs on the oxygen atom directly bonded to the aromatic carbon. Through +M resonance donation, it delocalizes electron density into the ring and strongly stabilizes the ortho and para arenium carbocations, making it a strong activating ortho/para director.',
      },
      {
        id: 'eas-q3',
        questionNumber: 3,
        questionText: 'During the chlorination of benzene in the presence of anhydrous FeCl₃ catalyst, what is the role of FeCl₃?',
        options: [
          'It acts as a Lewis base to abstract the ring proton',
          'It acts as a Lewis acid to polarize the Cl-Cl bond and generate an electrophilic chlorine complex',
          'It acts as a reducing agent to convert benzene into chlorobenzene',
          'It stabilizes the final aromatic product',
        ],
        correctOptionIndex: 1,
        correctOptionLetter: 'B',
        hint: 'FeCl₃ has an incomplete octet on iron and coordinates with a chlorine molecule to form [FeCl₄]⁻ and an electrophilic Cl⁺ donor.',
        formula: 'Cl_2 + FeCl_3 \\rightleftharpoons Cl^{\\delta+} \\cdots Cl \\cdots FeCl_3^{\\delta-}',
        aiExplanation: 'FeCl₃ functions as a Lewis acid by accepting electron density from one chlorine atom of Cl₂, forming a polarized [Cl---FeCl₄] complex or delivering Cl⁺. This increases electrophilicity sufficiently to overcome the high activation barrier of aromatic ring attack.',
      },
      {
        id: 'eas-q4',
        questionNumber: 4,
        questionText: 'What is the rate-determining step (RDS) in standard electrophilic aromatic substitution reactions?',
        options: [
          'Generation of the electrophile',
          'Attack of the aromatic π-electron cloud on the electrophile to form the Wheland sigma complex',
          'Deprotonation of the sigma complex by base',
          'Regeneration of the Lewis acid catalyst',
        ],
        correctOptionIndex: 1,
        correctOptionLetter: 'B',
        hint: 'The slowest step involves loss of aromatic resonance stabilization energy to form the carbocation intermediate.',
        formula: '\\text{Benzene} + E^+ \\xrightarrow{k_1 \\text{ (Slow)}} [\\sigma\\text{-complex}]^+',
        aiExplanation: 'The first step requires disrupting the highly stable 6 π-electron aromatic sextet to create the non-aromatic Wheland intermediate (arenium cation). This step has the highest activation energy and is the rate-determining step in EAS.',
      },
      {
        id: 'eas-q5',
        questionNumber: 5,
        questionText: 'Halogens (-Cl, -Br) attached to a benzene ring exhibit a unique electronic behavior in EAS. Which statement correctly describes this behavior?',
        options: [
          'They are activating and ortho/para-directing',
          'They are deactivating and meta-directing',
          'They are deactivating and ortho/para-directing',
          'They are activating and meta-directing',
        ],
        correctOptionIndex: 2,
        correctOptionLetter: 'C',
        hint: 'Strong inductive withdrawal (-I) lowers overall ring electron density, but lone pair resonance (+M) specifically stabilizes ortho and para attack.',
        formula: '\\text{Reactivity: } -I > +M \\text{ (Deactivating)}; \\quad \\text{Orientation: } +M \\text{ stabilizes o/p}',
        aiExplanation: 'Halogens have high electronegativity causing strong inductive electron withdrawal (-I > +M), which deactivates the benzene ring compared to unsubstituted benzene. However, lone pair resonance donation (+M) specifically stabilizes the arenium ion when attack occurs at the ortho and para positions, making halogens deactivating yet ortho/para-directing.',
      },
    ],
  },
  'wt-3': {
    topicId: 'wt-3',
    topicName: 'Human Endocrine System',
    subject: 'Biology',
    description: 'Master endocrine gland anatomy, peptide vs steroid hormone signaling pathways, hypothalamic-pituitary feedback loops, and metabolic regulation.',
    targetXp: 150,
    timeLimitSeconds: 600,
    theory: {
      title: 'Human Endocrine System: Hormone Regulation & Feedback Mechanics',
      summary: 'Comprehensive analysis of ductless gland architecture, chemical classifications of hormones, intracellular vs cell-surface signaling, and negative feedback control.',
      paragraphs: [
        'The human endocrine system constitutes a distributed regulatory network of ductless glands that synthesize chemical messengers known as hormones and secrete them directly into interstitial fluids and the vascular circulation. Operating at nanomolar and picomolar concentrations, hormones travel systemically to elicit specific physiological responses exclusively in target organs and tissues expressing cognate high-affinity receptors. This chemical signaling network coordinates metabolism, growth, fluid balance, and reproduction.',
        'Hormones are categorized biochemically into hydrophilic peptide/protein hormones (e.g., insulin, glucagon, TSH, ACTH), amino acid derivatives (e.g., epinephrine, thyroxine), and lipophilic steroid hormones (e.g., cortisol, aldosterone, estrogen, testosterone). Water-soluble peptide hormones cannot traverse the lipid bilayer; instead, they bind to cell-surface transmembrane receptors (such as GPCRs or receptor tyrosine kinases), triggering intracellular second-messenger cascades (cAMP, IP3/DAG, Ca²⁺). In contrast, lipophilic steroid hormones diffuse across plasma membranes to bind intracellular receptors that translocate to the nucleus and modulate target gene transcription.',
        'The hypothalamic-pituitary axis functions as the master neuroendocrine coordination center. Neurosecretory cells in the hypothalamus synthesize releasing and inhibiting hormones (e.g., TRH, GnRH, CRH, GHRH) and discharge them into the hypophyseal portal bloodstream to control hormone synthesis in the anterior pituitary (adenohypophysis). Tropic hormones released by the anterior pituitary subsequently travel to peripheral endocrine organs (thyroid, adrenal cortex, gonads) to regulate effector hormone release.',
        'Homeostasis is maintained through robust negative feedback loops. In the thyroid axis, elevated circulating levels of thyroxine (T4) and triiodothyronine (T3) exert direct inhibitory feedback on both hypothalamic TRH release and anterior pituitary TSH secretion. Similarly, pancreatic islets of Langerhans regulate blood glucose via antagonistic actions: beta cells secrete insulin to stimulate GLUT4 translocation and cellular glucose uptake, while alpha cells secrete glucagon during hypoglycemia to activate hepatic glycogenolysis.'
      ],
      keyTakeaways: [
        'Endocrine glands are ductless; hormones travel via bloodstream to specific target receptors.',
        'Peptide hormones bind cell-surface GPCRs and trigger second messengers (cAMP, IP3, Ca²⁺).',
        'Lipophilic steroid hormones cross cell membranes and regulate gene transcription in the nucleus.',
        'Negative feedback servomechanisms maintain hormonal setpoints and prevent hyper/hyposecretion.'
      ],
      formula: '\\text{Hypothalamus [TRH]} \\rightarrow \\text{Anterior Pituitary [TSH]} \\rightarrow \\text{Thyroid [T3/T4]} \\xrightarrow{\\text{Negative Feedback}} (-)'
    },
    questions: [
      {
        id: 'endo-q1',
        questionNumber: 1,
        questionText: 'Which endocrine cell type in the pancreatic Islets of Langerhans is responsible for secreting insulin in response to elevated blood glucose levels?',
        options: [
          'Alpha (α) cells',
          'Beta (β) cells',
          'Delta (δ) cells',
          'F (PP) cells',
        ],
        correctOptionIndex: 1,
        correctOptionLetter: 'B',
        hint: 'Beta cells synthesize proinsulin and make up approximately 65-80% of the islet cell population.',
        formula: '\\text{Blood Glucose } \\uparrow \\implies \\beta\\text{-cells release Insulin } \\implies \\text{GLUT4 Translocation}',
        aiExplanation: 'Beta (β) cells located in the Islets of Langerhans detect elevated extracellular glucose via GLUT2 transporters and glucokinase, triggering insulin secretion. Insulin promotes cellular uptake of glucose in skeletal muscle and adipose tissue and stimulates glycogen synthesis in the liver.',
      },
      {
        id: 'endo-q2',
        questionNumber: 2,
        questionText: 'Steroid hormones (such as cortisol and aldosterone) exert their primary physiological actions by binding to which type of cellular receptor?',
        options: [
          'Cell-surface G-protein coupled receptors (GPCRs)',
          'Transmembrane receptor tyrosine kinases',
          'Intracellular (cytoplasmic or nuclear) receptors that act as transcription factors',
          'Ligand-gated extracellular ion channels',
        ],
        correctOptionIndex: 2,
        correctOptionLetter: 'C',
        hint: 'Steroid hormones are lipid-soluble derivatives of cholesterol and readily diffuse across the plasma membrane.',
        formula: '\\text{Steroid} + \\text{Nuclear Receptor} \\rightarrow \\text{Hormone-Receptor Complex} \\rightarrow \\text{Gene Transcription}',
        aiExplanation: 'Because steroid hormones are lipophilic molecules derived from cholesterol, they pass through lipid bilayers and bind to intracellular cytoplasmic or nuclear receptors. The hormone-receptor complex acts directly on DNA response elements to alter gene transcription.',
      },
      {
        id: 'endo-q3',
        questionNumber: 3,
        questionText: 'Which hormone is synthesized by the hypothalamus and stored/released from the posterior pituitary (neurohypophysis) to regulate water reabsorption in the renal collecting ducts?',
        options: [
          'Antidiuretic Hormone (ADH / Vasopressin)',
          'Aldosterone',
          'Adrenocorticotropic Hormone (ACTH)',
          'Atrial Natriuretic Peptide (ANP)',
        ],
        correctOptionIndex: 0,
        correctOptionLetter: 'A',
        hint: 'Also known as arginine vasopressin, this nonapeptide hormone inserts aquaporin-2 channels into collecting duct apical membranes.',
        formula: '\\text{ADH} \\rightarrow \\text{V2 Receptor} \\rightarrow \\text{cAMP} \\rightarrow \\text{Aquaporin-2 Insertion}',
        aiExplanation: 'Antidiuretic Hormone (ADH or Vasopressin) is synthesized in the supraoptic and paraventricular nuclei of the hypothalamus and transported to the posterior pituitary for release. It binds to V2 receptors in renal collecting ducts, promoting aquaporin-2 insertion and water reabsorption.',
      },
      {
        id: 'endo-q4',
        questionNumber: 4,
        questionText: 'What is the physiological consequence of an overproduction of Parathyroid Hormone (PTH)?',
        options: [
          'Severe hypocalcemia and tetany',
          'Hypercalcemia, bone demineralization, and increased renal calcium reabsorption',
          'Decreased intestinal absorption of calcium',
          'Suppression of active Vitamin D (Calcitriol) synthesis',
        ],
        correctOptionIndex: 1,
        correctOptionLetter: 'B',
        hint: 'PTH acts on osteoclasts to mobilize calcium from bone and stimulates 1-alpha-hydroxylase in the kidney.',
        formula: '\\text{PTH} \\implies \\text{Bone Resorption } \\uparrow + \\text{Renal Ca}^{2+} \\text{ Reabsorption } \\uparrow \\implies [\\text{Ca}^{2+}]_{\\text{plasma}} \\uparrow',
        aiExplanation: 'Parathyroid Hormone (PTH) acts to raise blood calcium levels by stimulating osteoclast activity (bone resorption), increasing renal tubular reabsorption of calcium, and activating vitamin D (calcitriol) to enhance intestinal calcium absorption. Excess PTH leads to hypercalcemia and osteoporosis.',
      },
      {
        id: 'endo-q5',
        questionNumber: 5,
        questionText: 'In the hypothalamic-pituitary-thyroid axis, how does elevated circulating Thyroxine (T4) maintain hormonal homeostasis?',
        options: [
          'By positive feedback stimulation of TRH and TSH release',
          'By negative feedback inhibition of hypothalamic TRH and anterior pituitary TSH release',
          'By destroying thyroid follicular cells',
          'By stimulating parathyroid hormone secretion',
        ],
        correctOptionIndex: 1,
        correctOptionLetter: 'B',
        hint: 'Standard negative feedback regulation shuts down upstream tropic hormone release when peripheral hormone levels rise.',
        formula: '[T_3/T_4] \\uparrow \\implies \\text{Inhibits TRH (Hypothalamus) and TSH (Anterior Pituitary)}',
        aiExplanation: 'The thyroid axis uses a classic negative feedback loop. When free circulating T4 and T3 concentrations rise above normal setpoints, they act on the hypothalamus to decrease TRH secretion and on the anterior pituitary thyrotrophs to decrease TSH release, restoring balanced hormone levels.',
      },
    ],
  },
  'wt-4': {
    topicId: 'wt-4',
    topicName: "Definite Integrals & King's Property",
    subject: 'Biology',
    description: "Master evaluation of trigonometric and algebraic definite integrals using King's Property ∫ f(x) dx = ∫ f(a+b-x) dx.",
    targetXp: 150,
    timeLimitSeconds: 600,
    theory: {
      title: "Definite Integrals: King's Rule & Symmetry Evaluation",
      summary: "Comprehensive mathematical derivation of King's symmetry property, interval reflection techniques, and step-by-step reduction of trigonometric and rational definite integrals.",
      paragraphs: [
        "King's Property is a fundamental symmetry identity in definite integral calculus stating that the integral of any continuous function f(x) over the interval [a, b] is identically equal to the integral of f(a + b - x) over the same interval: ∫[a to b] f(x) dx = ∫[a to b] f(a + b - x) dx. This identity is derived through a linear transformation substituting u = a + b - x (du = -dx), reflecting the integrand across the interval midpoint.",
        "The primary utility of King's property arises when evaluating integrals where direct antiderivative computation is intractable. By defining the original integral as I = ∫[a to b] f(x) dx and the King's transformed integral as I = ∫[a to b] f(a + b - x) dx, adding the two equations yields 2I = ∫[a to b] [f(x) + f(a + b - x)] dx. In trigonometric and rational forms, the sum inside the integrand frequently simplifies algebraically to a constant or elementary function.",
        "A notorious source of careless errors in competitive exams is failing to divide by the coefficient of 2 at the conclusion of the derivation. When 2I = b - a is evaluated, the true integral value is I = (b - a) / 2. Rigorous self-checking demands tracking the factor of 1/2 explicitly at each operational stage.",
        "King's property also generalizes powerfully to integrals of odd and even functions over symmetric intervals [-a, a]. For any function f(x), ∫[-a to a] f(x) dx = ∫[0 to a] [f(x) + f(-x)] dx. If f(x) is odd (f(-x) = -f(x)), the integrand vanishes identically to 0; if even (f(-x) = f(x)), the integral simplifies to 2 ∫[0 to a] f(x) dx."
      ],
      keyTakeaways: [
        "King's Identity: ∫_a^b f(x) dx = ∫_a^b f(a + b - x) dx.",
        "Add original and reflected integrals: 2I = ∫_a^b [f(x) + f(a + b - x)] dx.",
        "Always divide by 2 at the final step to obtain the true integral I.",
        "Symmetric intervals: Odd functions integrate to 0 over [-a, a]."
      ],
      formula: 'I = \\frac{1}{2} \\int_{a}^{b} \\left[ f(x) + f(a+b-x) \\right] dx, \\quad \\int_{-a}^{a} f_{\\text{odd}}(x) dx = 0'
    },
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
  'wt-5': {
    topicId: 'wt-5',
    topicName: "Le Chatelier's Principle & Inert Gas Addition",
    subject: 'Chemistry',
    description: 'Master equilibrium shifts upon inert gas addition at constant pressure vs constant volume, temperature changes, and catalyst effects.',
    targetXp: 150,
    timeLimitSeconds: 600,
    theory: {
      title: "Chemical Equilibrium: Le Chatelier's Principle & Gas Dynamics",
      summary: "In-depth analysis of reversible reaction equilibrium positions, reaction quotients (Q_p vs K_p), and inert gas additions at constant volume versus constant pressure.",
      paragraphs: [
        "Le Chatelier's Principle governs the dynamic behavior of reversible chemical systems at equilibrium: if an external stress (such as a change in concentration, partial pressure, total volume, or temperature) is imposed on a system at equilibrium, the system shifts its equilibrium position in a direction that opposes or relieves the applied stress.",
        "When an inert gas (such as Helium or Argon) is injected into a closed equilibrium vessel at CONSTANT VOLUME, total vessel pressure increases. However, because volume V remains fixed and temperature T is constant, the partial pressure (p_i = n_i R T / V) and molar concentration of each reacting species remain completely unchanged. Consequently, the reaction quotient Q_p remains equal to K_p, and the equilibrium position experiences ZERO shift.",
        "Conversely, when an inert gas is introduced at CONSTANT PRESSURE, the container volume must expand to accommodate the added gas moles. This volumetric expansion dilutes all reacting species, causing their partial pressures to drop simultaneously. In response, the system shifts in the direction that produces MORE gaseous moles (Δn_g > 0) to replenish total gas particles.",
        "Temperature alterations uniquely affect the numerical magnitude of the equilibrium constant K_p itself. For exothermic reactions (ΔH < 0), adding heat shifts equilibrium in the reverse endothermic direction, lowering K_p. For endothermic reactions (ΔH > 0), elevating temperature increases K_p and favors product formation."
      ],
      keyTakeaways: [
        "Constant Volume inert gas addition does NOT shift equilibrium (partial pressures unchanged).",
        "Constant Pressure inert gas addition expands volume and shifts equilibrium toward more gaseous moles (Δn_g > 0).",
        "Catalysts accelerate forward and reverse reaction rates equally; they DO NOT alter K_p or equilibrium yields.",
        "Exothermic reactions are favored by low temperature; endothermic reactions are favored by high temperature."
      ],
      formula: 'K_p = \\frac{(p_C)^c (p_D)^d}{(p_A)^a (p_B)^b}, \\quad \\Delta n_g = \\sum n_{\\text{products, gas}} - \\sum n_{\\text{reactants, gas}}'
    },
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
};

// Aliases for topic IDs
const legacyFriction = {
  ...PRACTICE_TOPIC_PACKS['wt-1'],
  topicId: 'topic-rotational-friction',
};
PRACTICE_TOPIC_PACKS['topic-rotational-friction'] = legacyFriction;

const legacyOrganic = {
  ...PRACTICE_TOPIC_PACKS['wt-2'],
  topicId: 'topic-organic-sn1-sn2',
};
PRACTICE_TOPIC_PACKS['topic-organic-sn1-sn2'] = legacyOrganic;

const legacyEndocrine = {
  ...PRACTICE_TOPIC_PACKS['wt-3'],
  topicId: 'topic-endocrine',
};
PRACTICE_TOPIC_PACKS['topic-endocrine'] = legacyEndocrine;

const legacyKings = {
  ...PRACTICE_TOPIC_PACKS['wt-4'],
  topicId: 'topic-definite-integral-kings',
};
PRACTICE_TOPIC_PACKS['topic-definite-integral-kings'] = legacyKings;

const legacyChatelier = {
  ...PRACTICE_TOPIC_PACKS['wt-5'],
  topicId: 'topic-le-chatelier-inert',
};
PRACTICE_TOPIC_PACKS['topic-le-chatelier-inert'] = legacyChatelier;

PRACTICE_TOPIC_PACKS['topic-lenz-law-flux'] = {
  ...PRACTICE_TOPIC_PACKS['wt-1'],
  topicId: 'topic-lenz-law-flux',
};

PRACTICE_TOPIC_PACKS['topic-1'] = legacyFriction;
PRACTICE_TOPIC_PACKS['topic-2'] = legacyChatelier;
PRACTICE_TOPIC_PACKS['topic-3'] = legacyKings;
PRACTICE_TOPIC_PACKS['assign-01'] = legacyFriction;
PRACTICE_TOPIC_PACKS['assign-02'] = legacyChatelier;
PRACTICE_TOPIC_PACKS['assign-03'] = legacyKings;
PRACTICE_TOPIC_PACKS['paper-02'] = legacyFriction;
PRACTICE_TOPIC_PACKS['paper-03'] = legacyChatelier;
PRACTICE_TOPIC_PACKS['paper-04'] = legacyKings;

export function getPracticeTopicPack(topicId?: string): PracticeTopicPack {
  if (!topicId) {
    return PRACTICE_TOPIC_PACKS['wt-1'];
  }

  const trimmed = topicId.trim();
  if (PRACTICE_TOPIC_PACKS[trimmed]) {
    return PRACTICE_TOPIC_PACKS[trimmed];
  }

  const lower = trimmed.toLowerCase();
  if (PRACTICE_TOPIC_PACKS[lower]) {
    return PRACTICE_TOPIC_PACKS[lower];
  }

  if (lower.includes('rotat') || lower.includes('torque') || lower.includes('friction') || lower.includes('incline') || lower.includes('rigid') || lower === 'wt-1') {
    return PRACTICE_TOPIC_PACKS['wt-1'];
  }
  if (lower.includes('electrophilic') || lower.includes('aromatic') || lower.includes('substitution') || lower.includes('benzene') || lower.includes('organic') || lower === 'wt-2') {
    return PRACTICE_TOPIC_PACKS['wt-2'];
  }
  if (lower.includes('endocrine') || lower.includes('hormone') || lower.includes('pituitary') || lower.includes('thyroid') || lower === 'wt-3') {
    return PRACTICE_TOPIC_PACKS['wt-3'];
  }
  if (lower.includes('integral') || lower.includes('king') || lower.includes('calculus') || lower === 'wt-4') {
    return PRACTICE_TOPIC_PACKS['wt-4'];
  }
  if (lower.includes('chatelier') || lower.includes('inert') || lower.includes('chemical-equilibrium') || lower.includes('le-chatelier') || lower === 'wt-5') {
    return PRACTICE_TOPIC_PACKS['wt-5'];
  }

  return PRACTICE_TOPIC_PACKS['wt-1'];
}

