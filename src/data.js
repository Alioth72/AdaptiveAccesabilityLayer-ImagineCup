export const concepts = [
    {
        id: 'motion',
        title: 'What is Motion?',
        explanation: 'Motion occurs when an object changes its position over time relative to a reference point. Everything in the universe is in motion, from the smallest atoms to the largest galaxies.',
        diagram: '/diagrams/motion_reference.png',
        additionalVisual: 'Think of a passenger in a moving train. To someone inside, they are still. To someone outside, they are moving.',
        questions: {
            standard: {
                text: 'Which of these best describes motion?',
                options: [
                    'Staying in the same place forever',
                    'Changing position with time',
                    'Moving only in a circle',
                    'Having a constant speed'
                ],
                correctAnswer: 1,
                feedback: "Motion is purely about position changing over time."
            },
            remedial: {
                text: 'If you walk from your chair to the door, have you experienced motion?',
                options: [
                    'No, because I am still inside',
                    'Yes, because my position changed',
                    'Only if I run'
                ],
                correctAnswer: 1,
                feedback: "Any change in position is considered motion."
            },
            advanced: {
                text: 'A passenger sitting in a moving train is at rest relative to...',
                options: [
                    'The train engine',
                    'The platform outside',
                    'The stars',
                    'A bird flying past'
                ],
                correctAnswer: 0,
                feedback: "Motion is relative. Relative to the train itself, the passenger isn't moving."
            }
        }
    },
    {
        id: 'velocity',
        title: 'Instantaneous Velocity',
        explanation: 'Instantaneous velocity is the speed of an object at a specific moment in time. Think of it like checking your car speedometer at a single glance while driving.',
        diagram: '/diagrams/xt_graph_tangent.png',
        additionalVisual: 'Imagine a radar gun pointing at a car. It captures the speed at that exact millisecond.',
        questions: {
            standard: {
                text: 'What does a speedometer measure?',
                options: [
                    'Average velocity',
                    'Total distance',
                    'Instantaneous speed',
                    'Acceleration'
                ],
                correctAnswer: 2,
                feedback: "It shows speed at that exact instant, not an average."
            },
            remedial: {
                text: 'Does instantaneous velocity change during a long trip?',
                options: [
                    'Yes, it changes whenever speed changes',
                    'No, it is always the same as average',
                    'Only if you stop'
                ],
                correctAnswer: 0,
                feedback: "It changes constantly as you drive, speed up, or slow down."
            },
            advanced: {
                text: 'On a position-time graph, instantaneous velocity is represented by...',
                options: [
                    'The area under the curve',
                    'The slope of the tangent at a point',
                    'The total length of the line',
                    'The y-intercept'
                ],
                correctAnswer: 1,
                feedback: "The slope of the tangent line gives the derivative (velocity) at that point."
            }
        }
    },
    {
        id: 'acceleration',
        title: 'Acceleration',
        explanation: 'Acceleration is the rate at which velocity changes. If you speed up, slow down, or change direction, you are accelerating.',
        diagram: '/diagrams/vt_graph_slope.png',
        additionalVisual: 'A rollercoaster turning a loop at constant speed is still accelerating because its direction is changing.',
        questions: {
            standard: {
                text: 'If a car turns a corner at constant speed, is it accelerating?',
                options: [
                    'Yes, because direction changes',
                    'No, speed is constant',
                    'Only if it speeds up',
                    'Only if it crashes'
                ],
                correctAnswer: 0,
                feedback: "Velocity is speed + direction, so changing direction counts as acceleration."
            },
            remedial: {
                text: 'Which of these is NOT acceleration?',
                options: [
                    'Pressing the gas pedal',
                    'Pressing the brake',
                    'Driving in a straight line at 50km/h',
                    'Turning a steering wheel'
                ],
                correctAnswer: 2,
                feedback: "Constant speed in a straight line means zero acceleration."
            },
            advanced: {
                text: 'If velocity is positive and acceleration is negative, the object is...',
                options: [
                    'Speeding up',
                    'Slowing down',
                    'Moving backwards',
                    'Stopped'
                ],
                correctAnswer: 1,
                feedback: "When signs oppose (pushing against motion), the object slows down."
            }
        }
    },
    {
        id: 'equations',
        title: 'Equations of Motion',
        explanation: 'There are three key equations that link velocity, displacement, acceleration, and time. These only apply when acceleration is constant (uniform).',
        diagram: '/diagrams/equations_flow.png',
        additionalVisual: 'Think of dropping a ball (constant gravity) vs driving in traffic (variable acceleration). Equations only work for the ball.',
        questions: {
            standard: {
                text: 'When can we use the standard equations (v = u + at, etc.)?',
                options: [
                    'Always',
                    'When acceleration varies',
                    'When speed is zero',
                    'When acceleration is constant'
                ],
                correctAnswer: 3,
                feedback: "Uniform (constant) acceleration is the key condition."
            },
            remedial: {
                text: 'Do these equations work for a car in heavy traffic (stop-and-go)?',
                options: [
                    'Yes',
                    'No, because acceleration changes wildly',
                    'Only at night'
                ],
                correctAnswer: 1,
                feedback: "Traffic implies variable acceleration, so the simple equations don't apply."
            },
            advanced: {
                text: 'Which equation relates Velocity, Displacement, and Acceleration (no Time)?',
                options: [
                    'v = u + at',
                    's = ut + ½at²',
                    'v² - u² = 2as',
                    'v = s/t'
                ],
                correctAnswer: 2,
                feedback: "v² - u² = 2as is the correct time-independent equation."
            }
        }
    },
    {
        id: 'freefall',
        title: 'Free Fall',
        explanation: 'Free fall is motion under the influence of gravity alone. Near Earth, all objects accelerate downwards at the same rate (9.8 m/s²), regardless of their mass.',
        diagram: '/diagrams/free_fall_graphs.png',
        additionalVisual: 'Apollo 15 astronaut dropped a hammer and feather on the Moon. They hit the ground at the exact same time.',
        questions: {
            standard: {
                text: 'In a vacuum, which falls faster: a feather or a hammer?',
                options: [
                    'The hammer',
                    'The feather',
                    'They fall at the same rate',
                    'Neither falls'
                ],
                correctAnswer: 2,
                feedback: "Gravity acts equally on all mass in a vacuum."
            },
            remedial: {
                text: 'Why does a feather fall slowly on Earth?',
                options: [
                    'It has no mass',
                    'Air resistance slows it down',
                    'Gravity ignores feathers'
                ],
                correctAnswer: 1,
                feedback: "Air resistance is the culprit, not gravity."
            },
            advanced: {
                text: 'A ball is thrown upward. At the very top of its path, its velocity is zero. What is its acceleration?',
                options: [
                    'Zero',
                    '9.8 m/s² downwards',
                    '9.8 m/s² upwards',
                    'Depends on the mass'
                ],
                correctAnswer: 1,
                feedback: "Gravity never stops acting, even when the object stops momentarily."
            }
        }
    }
];

export const videoNotes = {
    title: "Physics - Motion in One Dimension (Video Analysis)",
    summary: "This video introduces the concept of 1D motion, differentiating between distance and displacement, and explaining speed vs velocity.",
    keyPoints: [
        "Distance is a scalar quantity (magnitude only), while Displacement is a vector (magnitude + direction).",
        "Average speed = Total distance / Total time.",
        "Average velocity = Net displacement / Total time.",
        "If you return to the starting point, your displacement and average velocity are zero, but distance is not.",
        "Slope of x-t graph gives velocity. Slope of v-t graph gives acceleration."
    ],
    transcriptSegment: "So when we talk about motion in a straight line, we only care about two directions: positive and negative. If I move 5 meters right and 5 meters left, my total distance is 10 meters, but my displacement is zero because I'm back where I started..."
};
