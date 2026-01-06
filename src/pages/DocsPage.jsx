import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Search, ChevronRight, BookOpen, Terminal, Users, Shield, Code, Trophy, Monitor, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DocsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSection, setActiveSection] = useState('welcome');

    const sections = [
        { id: 'welcome', title: 'User Instructions', icon: BookOpen },
        { id: 'arena', title: 'The Arena (Solo & Ranked)', icon: Zap },
        { id: 'groupbattle', title: 'Hosting Group Battles', icon: Users },
        { id: 'inputs', title: 'Coding Input Guide', icon: Terminal },
        { id: 'leaderboard', title: 'Ranking System (ELO)', icon: Trophy },
        { id: 'visualizer', title: 'Control Visualizer', icon: Monitor },
    ];

    const content = {
        welcome: (
            <div className="animate-in">
                <h1 className="doc-title">How to Use Valkry</h1>
                <p className="doc-text">
                    This documentation is the definitive user manual for the Valkry platform.
                    It is designed to precise specifications to help you understand not just <em>what</em> precise feature does, but <em>why</em> and <em>how</em> to use it effectively.
                </p>
                <div className="doc-divider"></div>
                <h2 className="doc-subtitle">Navigation</h2>
                <ul className="doc-list">
                    <li><strong>The Arena:</strong> Your home for competitive play (Solo, Ranked, Team Battles).</li>
                    <li><strong>Input Guide:</strong> <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>REQUIRED READING</span> for creating Custom Problems.</li>
                    <li><strong>Leaderboard:</strong> Understanding how your ELO is calculated.</li>
                </ul>
            </div>
        ),
        arena: (
            <div className="animate-in">
                <h1 className="doc-title">The Arena</h1>
                <p className="doc-text">
                    The Arena is the central hub for all standard competitive interactions. It hosts four distinct battle modes.
                </p>

                <h2 className="doc-subtitle">1. Solo Practice</h2>
                <p className="doc-text">
                    <strong>Purpose:</strong> To practice specific algorithms without ELO penalty.
                    <br />
                    <strong>How to Use:</strong> Click "Solo Practice". Select a problem category.
                    <br />
                    <strong>Note:</strong> You can reveal the solution if stuck, but this forfeits the session. Use this as a learning tool.
                </p>

                <h2 className="doc-subtitle">2. Ranked Matchmaking (1v1)</h2>
                <p className="doc-text">
                    <strong>Purpose:</strong> To gain global rank.
                    <br />
                    <strong>Mechanism:</strong> The system searches for an opponent within ±200 ELO of your rating.
                    <br />
                    <strong>Winning Condition:</strong> You must solve ALL test cases. Speed is the tie-breaker. If you finish in 2 minutes and your opponent finishes in 3, you win.
                </p>

                <h2 className="doc-subtitle">3. Direct Challenge</h2>
                <p className="doc-text">
                    <strong>Purpose:</strong> To play against a specific friend.
                    <br />
                    <strong>How to Use:</strong> Navigate to the "Friends" tab. If a friend is ONLINE (Green Dot), click the Sword icon. They will receive a pop-up invitation.
                </p>

                <h2 className="doc-subtitle">4. Group Battles (Tournament Mode)</h2>
                <p className="doc-text">
                    <strong>Purpose:</strong> Large-scale team competitions.
                    <br />
                    <strong>Location:</strong> Accessed via the "Group Battle" button in the Arena Lobby.
                    <br />
                    <em>See the "Hosting Group Battles" section for full management details.</em>
                </p>
            </div>
        ),
        groupbattle: (
            <div className="animate-in">
                <h1 className="doc-title">Hosting Group Battles</h1>
                <p className="doc-text">
                    Group Battles allow you to be the <strong>Organizer</strong>. You can host tournaments, hackathons, or class contests.
                    As the host, you have special controls.
                </p>

                <div className="doc-divider"></div>

                <h2 className="doc-subtitle">The Manager Role</h2>
                <p className="doc-text">
                    As the creator of the lobby, you have specific powers:
                </p>
                <ul className="doc-list">
                    <li><strong>Drag & Drop Assignment:</strong> You must manually drag players from the "Unassigned" pool into Team Red or Team Blue (or others).</li>
                    <li><strong>Problem Selection:</strong> You choose the specific problems for the battle.</li>
                    <li><strong>Start/Stop:</strong> Only you can launch the battle.</li>
                </ul>

                <h2 className="doc-subtitle">Using Custom Problems</h2>
                <p className="doc-text">
                    The most powerful feature of Group Battles is the ability to write your own problems.
                    <br />
                    <strong>Why use this?</strong> To test your friends on specific concepts (e.g., "Only Dynamic Programming") that aren't in the standard library.
                </p>

                <h3 className="doc-section-head">How to create a valid problem:</h3>
                <p className="doc-text">
                    1. <strong>Title:</strong> Keep it short.
                    <br />
                    2. <strong>Test Cases:</strong> You MUST provide inputs and expected outputs.
                    <br />
                    3. <strong>Strictness:</strong> The inputs you provide here are fed <em>directly</em> to the C++ standard input.
                    <br />
                    <br />
                    <span style={{ color: 'var(--red)', fontWeight: 'bold' }}>IMPORTANT:</span> You must refer to the <strong>Coding Input Guide</strong> to format your Test Case Inputs correctly. If you format them wrong (e.g. missing the Array Size integer), your custom problem will be impossible to solve.
                </p>
            </div>
        ),
        inputs: (
            <div className="animate-in">
                <h1 className="doc-title">Coding Input Guide</h1>
                <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', marginBottom: '32px', background: 'var(--bg-secondary)' }}>
                    <h3 style={{ fontSize: '16px', margin: '0 0 8px 0', fontWeight: '600' }}>NOTICE TO PROBLEM CREATORS</h3>
                    <p style={{ fontSize: '14px', margin: 0, color: 'var(--text-secondary)' }}>
                        This input specification is mandatory for the Custom Problem creation interface.
                        Test cases entered in the Manager Panel must adhere strictly to these formats to ensure compatibility with the C++ execution environment.
                    </p>
                </div>

                <p className="doc-text">
                    <strong>Technical Context:</strong>
                    <br />
                    Valkry utilizes a Full Program Execution model.
                    User submissions are compiled as standalone C++ binaries, with test data piped via Standard Input (`cin`).
                    Correct input parsing is a prerequisite for successful execution.
                </p>

                <div className="doc-divider"></div>

                <h3 className="doc-section-head">1. Integers & Decimals</h3>
                <p className="doc-text">
                    <strong>Input Format:</strong> Values separated by space or newline.
                    <br />
                    <strong>Example:</strong> `5 10 3.14`
                </p>
                <div className="code-block">
                    <div className="code-content hl">
                        int a, b; double c;<br />
                        cin &gt;&gt; a &gt;&gt; b &gt;&gt; c;
                    </div>
                </div>

                <h3 className="doc-section-head">2. Large Integers (64-bit)</h3>
                <p className="doc-text">
                    <strong>When to use:</strong> If the number can exceed 2 Billion (2^31).
                    <br />
                    <strong>Type:</strong> Use `long long` instead of `int`.
                </p>
                <div className="code-block">
                    <div className="code-content hl">
                        long long bigNum;<br />
                        cin &gt;&gt; bigNum;
                    </div>
                </div>

                <h3 className="doc-section-head">3. Single Characters</h3>
                <p className="doc-text">
                    <strong>Input Format:</strong> A single character (ignoring whitespace).
                    <br />
                    <strong>Example:</strong> `A` or `+`
                </p>
                <div className="code-block">
                    <div className="code-header">Input: A +</div>
                    <div className="code-content hl">
                        char c1, c2;<br />
                        cin &gt;&gt; c1 &gt;&gt; c2; // reads 'A' then '+'
                    </div>
                </div>

                <h3 className="doc-section-head">4. Strings (Text)</h3>
                <p className="doc-text">
                    String input handling varies based on the presence of whitespace.
                </p>

                <div style={{ marginLeft: '16px', borderLeft: '2px solid var(--border)', paddingLeft: '16px', marginBottom: '24px' }}>
                    <h4 style={{ color: 'var(--text)', fontSize: '15px', marginTop: '16px' }}>Scenario A: Non-Whitespace Delimited Tokens</h4>
                    <p className="doc-text" style={{ fontSize: '14px' }}>Use `cin` for single words. Processing terminates at the first whitespace character.</p>
                    <div className="code-block" style={{ margin: '8px 0' }}>
                        <div className="code-header">Input: "Hello"</div>
                        <div className="code-content hl">string s; cin &gt;&gt; s;</div>
                    </div>

                    <h4 style={{ color: 'var(--text)', fontSize: '15px', marginTop: '24px' }}>Scenario B: Newline Delimited Text</h4>
                    <p className="doc-text" style={{ fontSize: '14px' }}>Use `getline` to consume the entire buffer up to the newline character.</p>
                    <div className="code-block" style={{ margin: '8px 0' }}>
                        <div className="code-header">Input: "Hello World"</div>
                        <div className="code-content hl">string s; getline(cin, s);</div>
                    </div>

                    <div style={{ marginTop: '12px', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                        <strong style={{ fontSize: '13px' }}>STREAM BUFFER MANAGEMENT:</strong>
                        <p style={{ fontSize: '13px', margin: '4px 0 0', color: 'var(--text-secondary)' }}>
                            When switching from `cin` to `getline`, the trailing newline character from the previous input remains in the buffer.
                            <br />
                            <strong>Resolution:</strong> Invoke `cin.ignore()` to flush the buffer before calling `getline`.
                        </p>
                    </div>
                </div>

                <h3 className="doc-section-head">5. Arrays (Fixed Size)</h3>
                <p className="doc-text">
                    <strong>When to use:</strong> "Simple Arrays". Good for small, fixed buffers.
                    <br />
                    <strong>Limitation:</strong> You must know the maximum size beforehand (e.g., 1000).
                </p>
                <div className="code-block">
                    <div className="code-header">Input: 3 10 20 30</div>
                    <div className="code-content hl">
                        int n; cin &gt;&gt; n;<br />
                        int arr[100]; // Max size buffer<br />
                        for(int i=0; i&lt;n; i++) cin &gt;&gt; arr[i];
                    </div>
                </div>

                <h3 className="doc-section-head">6. Vectors (Dynamic Arrays)</h3>
                <p className="doc-text">
                    <strong>Recommended:</strong> The modern C++ standard. Resizes automatically.
                    <br />
                    <strong>Required Format:</strong> [SIZE] [ELEMENT_1] [ELEMENT_2] ...
                </p>
                <div className="code-block">
                    <div className="code-header">Input: 3 100 200 300</div>
                    <div className="code-content hl">
                        int n; cin &gt;&gt; n;<br />
                        vector&lt;int&gt; v(n);<br />
                        for(int i=0; i&lt;n; i++) cin &gt;&gt; v[i];
                    </div>
                </div>

                <h3 className="doc-section-head">7. Matrices (2D Grids)</h3>
                <p className="doc-text">
                    <strong>Required Format:</strong> [ROWS] [COLS] [DATA...]
                    <br />
                    <strong>Example:</strong> A 2x2 grid `[[1,2], [3,4]]`
                </p>
                <div className="code-block">
                    <div className="code-header">Input: 2 2 1 2 3 4</div>
                    <div className="code-content hl">
                        int rows, cols; cin &gt;&gt; rows &gt;&gt; cols;<br />
                        // Nested Loop to read data...<br />
                        for(int i=0; i&lt;rows; i++)<br />
                        &nbsp;&nbsp;for(int j=0; j&lt;cols; j++)<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;cin &gt;&gt; grid[i][j];
                    </div>
                </div>
            </div>
        ),
        leaderboard: (
            <div className="animate-in">
                <h1 className="doc-title">Ranking System (ELO)</h1>
                <p className="doc-text">
                    Valkry uses a modified ELO system similar to Chess to ensure fair matchmaking.
                </p>

                <h2 className="doc-subtitle">The Formula</h2>
                <div className="code-block">
                    <div className="code-content hl">
                        New Rating = Old Rating + K * (Actual Score - Expected Score)
                    </div>
                </div>

                <h2 className="doc-subtitle">What determines 'K'?</h2>
                <p className="doc-text">
                    The 'K-Factor' determines how volatile your rating is.
                </p>
                <ul className="doc-list">
                    <li><strong>Placement (K=40):</strong> For your first 30 battles, K is high (40). This allows you to rapidly reach your "true" skill level.</li>
                    <li><strong>Standard (K=20):</strong> After 30 battles, K drops to 20. Your rating becomes more stable and harder to swing wildly.</li>
                </ul>

                <h2 className="doc-subtitle">Ranks</h2>
                <p className="doc-text">
                    - <strong>Bronze:</strong> &lt; 1000<br />
                    - <strong>Silver:</strong> 1000 - 1199<br />
                    - <strong>Gold:</strong> 1200 - 1399<br />
                    - <strong>Platinum:</strong> 1400 - 1599<br />
                    - <strong>Diamond:</strong> 1600 - 1999<br />
                    - <strong>Master:</strong> 2000 - 2499<br />
                    - <strong>Legendary:</strong> 2500+
                </p>
            </div>
        ),
        visualizer: (
            <div className="animate-in">
                <h1 className="doc-title">Control Visualizer</h1>
                <p className="doc-text">
                    The Control Visualizer is not a generic algorithm debugger — it is a <strong>specialized learning tool for C++ control flow</strong>.
                    Designed for students and developers who want to deeply understand how C++ executes code, it provides instruction-by-instruction
                    visualization of loops, conditionals, operators, and <strong>Object-Oriented Programming (OOP) concepts</strong>.
                </p>

                <h2 className="doc-subtitle">Why Use This?</h2>
                <p className="doc-text">
                    Unlike traditional debuggers that show raw memory states, the Control Visualizer highlights <em>which instruction is executing</em>,
                    <em>why control flows in a particular direction</em>, and <em>what values change at each step</em>. This is ideal for learners who need
                    to see the "invisible" flow of execution that textbooks describe but rarely demonstrate.
                </p>

                <h2 className="doc-subtitle">Core C++ Topics Covered</h2>
                <ul className="doc-list">
                    <li><strong>For Loops:</strong> Standard, no-init, no-increment, multi-variable, nested</li>
                    <li><strong>While Loops:</strong> Standard while, do-while (body-first execution)</li>
                    <li><strong>Control Statements:</strong> break, continue, and their exact exit points</li>
                    <li><strong>Operators:</strong> Prefix vs Postfix (++x vs x++), arithmetic precedence, ternary, bitwise</li>
                    <li><strong>Conditionals:</strong> if-else, else-if chains, switch-case with fallthrough</li>
                    <li><strong>Variables:</strong> Declaration, data types, type casting, scope</li>
                </ul>

                <h2 className="doc-subtitle">Advanced OOP Topics</h2>
                <p className="doc-text">
                    The Visualizer now includes <strong>12+ complex OOP programs</strong> demonstrating inheritance and polymorphism at an expert level:
                </p>
                <ul className="doc-list">
                    <li><strong>Single Inheritance:</strong> How constructors chain from base to derived</li>
                    <li><strong>Multi-Level Inheritance:</strong> 3-level chain (Grandparent → Parent → Child)</li>
                    <li><strong>Parameterized Constructors:</strong> Initializer lists passing args to base classes</li>
                    <li><strong>Destructor Chain:</strong> Reverse order destruction (Derived → Base)</li>
                    <li><strong>Virtual Functions:</strong> Runtime polymorphism with VTABLE dispatch</li>
                    <li><strong>Static vs Dynamic Binding:</strong> With and without virtual keyword</li>
                    <li><strong>Pure Virtual / Abstract Classes:</strong> Interface enforcement</li>
                    <li><strong>Multiple Inheritance:</strong> Constructor order (left to right)</li>
                    <li><strong>Diamond Problem:</strong> Virtual inheritance to solve ambiguity</li>
                    <li><strong>Static Members:</strong> Class-level shared state</li>
                    <li><strong>This Pointer:</strong> Self-reference and method chaining</li>
                    <li><strong>4-Level Polymorphism:</strong> Deep inheritance with virtual dispatch</li>
                </ul>

                <h2 className="doc-subtitle">How It Works</h2>
                <ul className="doc-list">
                    <li><strong>Step-by-Step Execution:</strong> Each instruction highlighted with exact character positions</li>
                    <li><strong>Variable Tracking:</strong> Watch values change in real-time at each step</li>
                    <li><strong>Control Flow Arrows:</strong> Visual indicators showing loop iterations, branches, exits</li>
                    <li><strong>Phase Labels:</strong> INIT, CONDITION, BODY, INCREMENT, CONSTRUCTOR, DESTRUCTOR, etc.</li>
                    <li><strong>Playback Controls:</strong> Play, Pause, Step Forward, adjust speed</li>
                </ul>

                <p className="doc-text" style={{ marginTop: '16px', fontStyle: 'italic', color: '#a1a1aa' }}>
                    More steps = more detail. These visualizations are designed to be exhaustive, showing every micro-decision
                    the CPU makes during execution.
                </p>
            </div>
        )
    };

    const filteredSections = sections.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(content[s.id]).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ minHeight: '100vh', background: '#09090b', color: '#e4e4e7', fontFamily: "'Inter', sans-serif" }}>
            <Navbar />
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', paddingTop: '80px', height: 'calc(100vh - 80px)' }}>
                {/* Sidebar */}
                <div style={{ width: '320px', borderRight: '1px solid #27272a', display: 'flex', flexDirection: 'column', background: '#0e0e11' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid #27272a' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                            <input
                                type="text"
                                placeholder="Search manual..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%', background: '#18181b', border: '1px solid #27272a',
                                    padding: '12px 12px 12px 40px', borderRadius: '6px', color: '#e4e4e7', fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                                    background: activeSection === section.id ? '#27272a' : 'transparent',
                                    color: activeSection === section.id ? '#fff' : '#a1a1aa',
                                    border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left',
                                    width: '100%', marginBottom: '4px', transition: 'all 0.1s'
                                }}
                            >
                                <section.icon size={18} strokeWidth={1.5} />
                                <span style={{ fontSize: '14px', fontWeight: '500' }}>{section.title}</span>
                            </button>
                        ))}
                    </div>
                    <div style={{ padding: '24px', borderTop: '1px solid #27272a' }}>
                        <p style={{ fontSize: '12px', color: '#52525b' }}>Valkry User Manual<br />v1.4.2</p>
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 48px' }}>
                        {searchTerm ? filteredSections.map(s => (
                            <div key={s.id} style={{ marginBottom: '80px' }}>{content[s.id]}</div>
                        )) : (
                            <div key={activeSection} style={{ animation: 'fadeIn 0.3s ease-out' }}>
                                {content[activeSection]}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
                    
                    .doc-title { font-size: 36px; font-weight: 800; letter-spacing: -1px; margin-bottom: 24px; color: #fff; }
                    .doc-subtitle { font-size: 24px; font-weight: 700; letter-spacing: -0.5px; margin-top: 48px; margin-bottom: 20px; color: #f4f4f5; }
                    .doc-section-head { font-size: 18px; font-weight: 600; margin-top: 32px; margin-bottom: 12px; color: #e4e4e7; }
                    .doc-text { font-size: 16px; line-height: 1.7; color: #d4d4d8; margin-bottom: 24px; }
                    .doc-divider { height: 1px; background: #27272a; margin: 40px 0; }
                    .doc-list { padding-left: 20px; color: #d4d4d8; line-height: 1.7; margin-bottom: 24px; }
                    .doc-list li { margin-bottom: 12px; }
                    
                    .code-block { background: #18181b; border: 1px solid #27272a; borderRadius: 8px; overflow: hidden; margin: 24px 0; }
                    .code-content { padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #d4d4d8; line-height: 1.5; white-space: pre-wrap; }
                    .code-content.hl { color: #a5b4fc; }

                `}
            </style>
        </div>
    );
};

export default DocsPage;
