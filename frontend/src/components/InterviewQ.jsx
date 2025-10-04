import React, { useState, useEffect, useMemo } from "react";

// The base list of questions, now including a category/field and an answer
const initialQuestions = [
  // 🌐 Web Development
  { text: "Explain event delegation in JavaScript.", field: "Web Development", answer: "Event delegation is a technique where you attach a single event listener to a parent element, rather than attaching separate event listeners to all its child elements. When an event is triggered on a child, it bubbles up to the parent, which handles the event based on the target element." },
  { text: "How does React's Virtual DOM work?", field: "Web Development", answer: "The Virtual DOM (VDOM) is a lightweight copy of the real DOM. When state changes, React updates the VDOM first. It then diffs the VDOM with the previous version and only applies the minimal necessary changes to the real DOM, optimizing performance." },
  { text: "Describe CSS Grid vs Flexbox.", field: "Web Development", answer: "Flexbox is a one-dimensional layout system (row or column), best for arranging content within a single container. CSS Grid is a two-dimensional layout system (rows and columns), best for designing main page layouts." },
  { text: "What are JavaScript Promises?", field: "Web Development", answer: "A Promise is an object representing the eventual completion or failure of an asynchronous operation. It can be in one of three states: pending, fulfilled, or rejected." },
  { text: "Explain async/await with an example.", field: "Web Development", answer: "Async/await is syntactic sugar built on Promises to make asynchronous code look and behave like synchronous code. The 'async' keyword marks a function that returns a Promise, and 'await' pauses execution until a Promise resolves." },
  { text: "What is closure in JavaScript?", field: "Web Development", answer: "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). It gives you access to an outer function's scope from an inner function, even after the outer function has finished execution." },
  { text: "Explain REST vs GraphQL.", field: "Web Development", answer: "REST relies on multiple endpoints (URLs) to access different resources, often leading to over- or under-fetching data. GraphQL uses a single endpoint and allows the client to precisely request only the data it needs, reducing payload size." },
  { text: "What is the difference between SSR and CSR?", field: "Web Development", answer: "SSR (Server-Side Rendering) renders the initial HTML on the server before sending it to the client. CSR (Client-Side Rendering) sends a minimal HTML file to the browser, which then fetches JavaScript to render content." },
  { text: "How do you optimize website performance?", field: "Web Development", answer: "Optimization techniques include: reducing HTTP requests, optimizing images, minifying CSS/JS, using browser caching, implementing lazy loading, and ensuring efficient rendering paths." },
  { text: "Explain CORS and how to handle it.", field: "Web Development", answer: "CORS (Cross-Origin Resource Sharing) is a browser security feature that restricts how a resource (like an API endpoint) on one domain can be requested by another domain. It is handled by setting the 'Access-Control-Allow-Origin' header on the server." },
  { text: "What are WebSockets and where are they used?", field: "Web Development", answer: "WebSockets provide a persistent, two-way communication channel over a single, long-lived TCP connection. They are used for real-time applications like chat apps, collaborative editing, and live sports tickers." },

  // 📊 Data Science
  { text: "Explain the Bias-Variance trade-off.", field: "Data Science", answer: "Bias is the error from overly simplistic assumptions in the learning algorithm (underfitting). Variance is the error from excessive complexity (overfitting). The trade-off is finding the sweet spot between these two to achieve maximum prediction accuracy." },
  { text: "What is the difference between supervised and unsupervised learning?", field: "Data Science", answer: "Supervised learning uses labeled data (input-output pairs) to train a model to predict the output. Unsupervised learning uses unlabeled data to discover hidden patterns and structures." },
  { text: "Describe the concept of 'p-value' and its use in testing.", field: "Data Science", answer: "The p-value is the probability of observing data as extreme as (or more extreme than) the one observed, assuming the null hypothesis is true. A small p-value (typically < 0.05) leads to the rejection of the null hypothesis." },
  { text: "How do you handle missing data (imputation techniques)?", field: "Data Science", answer: "Methods include dropping rows/columns, filling with a constant value, filling with mean/median/mode, or using complex models (like k-Nearest Neighbors or regression) to predict the missing values." },
  { text: "Explain the workflow of a typical machine learning project.", field: "Data Science", answer: "The typical workflow includes: Data Collection, Data Cleaning/Preprocessing, Feature Engineering, Model Training, Model Evaluation, Hyperparameter Tuning, and Model Deployment/Monitoring." },
  { text: "What is regularization (L1 and L2) and why is it necessary?", field: "Data Science", answer: "Regularization is a technique used to prevent overfitting by adding a penalty term to the loss function. L1 (Lasso) adds the absolute value of coefficients, potentially driving some to zero (feature selection). L2 (Ridge) adds the squared value of coefficients." },
  { text: "Describe how a Convolutional Neural Network (CNN) works.", field: "Data Science", answer: "CNNs are specialized for image processing, using convolutional layers to apply filters and extract features, pooling layers for dimensionality reduction, and fully connected layers for classification." },
  { text: "What are confusion matrix, precision, and recall?", field: "Data Science", answer: "A confusion matrix summarizes model predictions. Precision is the ratio of true positives to all predicted positives (how many selected items are relevant). Recall is the ratio of true positives to all actual positives (how many relevant items are selected)." },
  { text: "Explain feature scaling and normalization.", field: "Data Science", answer: "Feature scaling transforms data to a specific range (e.g., Min-Max normalization), while standardization (Z-score normalization) transforms data to have a mean of zero and a standard deviation of one. This is crucial for distance-based algorithms." },
  { text: "What are PCA and dimensionality reduction?", field: "Data Science", answer: "Dimensionality reduction is the process of reducing the number of random variables under consideration. PCA (Principal Component Analysis) is a linear technique used for this, finding directions (principal components) that maximize the variance." },

  // 💻 Software Engineering
  { text: "What are the four pillars of OOP?", field: "Software Engineering", answer: "The four pillars are: Abstraction (hiding complexity), Encapsulation (bundling data and methods), Inheritance (passing properties to subclasses), and Polymorphism (allowing one interface to be used for a general class of actions)." },
  { text: "Explain polymorphism and method overloading.", field: "Software Engineering", answer: "Polymorphism means 'many forms,' allowing an object to take on many types. Method overloading is a specific type of static polymorphism where multiple methods in the same class share the same name but have different parameters." },
  { text: "Describe the Singleton design pattern and its drawbacks.", field: "Software Engineering", answer: "The Singleton pattern restricts the instantiation of a class to a single object. Drawbacks include making code harder to test, often hiding dependencies, and potentially violating the Single Responsibility Principle." },
  { text: "What is Big O notation and how do you analyze algorithm complexity?", field: "Software Engineering", answer: "Big O notation describes the limiting behavior of a function when the argument tends towards a particular value or infinity, typically used to classify algorithms by their time or space requirement growth rate." },
  { text: "Explain the difference between threading and multi-processing.", field: "Software Engineering", answer: "Threads share the same memory space within a single process, making communication fast but prone to race conditions. Processes have separate memory spaces, making them more robust but slower for inter-process communication." },
  { text: "What is a deadlock and how can it be prevented?", field: "Software Engineering", answer: "A deadlock is a situation where two or more competing actions are waiting for the other to finish, and thus neither ever finishes. Prevention involves breaking one of the four necessary conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait." },
  { text: "Describe event bubbling and capturing.", field: "Software Engineering", answer: "When an event occurs on an element, it first travels down the DOM tree (capturing phase) to the target element, and then travels back up the DOM tree (bubbling phase) to the root. Bubbling is the default behavior." },
  { text: "Explain SOLID principles in software design.", field: "Software Engineering", answer: "SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable: Single responsibility, Open/closed, Liskov substitution, Interface segregation, and Dependency inversion." },
  { text: "What is version control, and why is Git popular?", field: "Software Engineering", answer: "Version control systems (VCS) track and manage changes to code. Git is popular because it is a distributed VCS, meaning every developer has a full copy of the repository, enabling fast, offline work and robust branching/merging." },
  { text: "What is Test Driven Development (TDD)?", field: "Software Engineering", answer: "TDD is a software development process relying on the repetition of a very short development cycle: requirements are turned into specific test cases, then the code is improved to pass the new tests." },

  // 🗄️ Database Systems
  { text: "What is normalization in databases? Explain 1NF, 2NF, 3NF.", field: "Database Systems", answer: "Normalization is the process of structuring a relational database in accordance with a series of so-called 'normal forms' to reduce data redundancy and improve data integrity. 1NF: Atomic values. 2NF: Must be in 1NF, and all non-key attributes are fully dependent on the primary key. 3NF: Must be in 2NF, and no transitive dependency exists between non-prime attributes." },
  { text: "Explain ACID properties in DBMS.", field: "Database Systems", answer: "ACID ensures reliable processing of database transactions: Atomicity (all or nothing), Consistency (only valid data is saved), Isolation (concurrent transactions are independent), and Durability (once committed, changes are permanent)." },
  { text: "What is the difference between SQL and NoSQL databases?", field: "Database Systems", answer: "SQL databases are relational, schema-based, and vertically scalable (e.g., PostgreSQL, MySQL). NoSQL databases are non-relational, schema-less (or flexible schema), and horizontally scalable (e.g., MongoDB, Cassandra)." },
  { text: "What is indexing and why is it used?", field: "Database Systems", answer: "An index is a data structure (like a B-tree) that improves the speed of data retrieval operations on database tables by providing fast lookups. It is used to quickly locate data without having to scan every row." },
  { text: "Explain database transactions with an example.", field: "Database Systems", answer: "A transaction is a single unit of work (e.g., transferring money from Account A to Account B). It typically involves multiple steps (debit A, credit B) that must either all succeed or all fail to maintain data integrity." },
  { text: "What are stored procedures and triggers?", field: "Database Systems", answer: "Stored procedures are pre-compiled SQL code saved in the database for reuse, enhancing performance and security. Triggers are special procedures automatically executed when a specific event occurs (e.g., INSERT, UPDATE, DELETE)." },
  { text: "Explain CAP theorem.", field: "Database Systems", answer: "The CAP theorem states that a distributed database system can only satisfy two of the following three guarantees at the same time: Consistency, Availability, and Partition Tolerance. Most distributed systems prioritize Partition Tolerance." },
  { text: "What are database joins? Explain inner, outer, and cross join.", field: "Database Systems", answer: "Joins combine rows from two or more tables based on a related column. Inner Join: Returns only matching rows. Outer Join (Left/Right/Full): Returns matching rows plus all rows from one or both tables, filling non-matches with NULL. Cross Join: Returns the Cartesian product of the rows." },

  // ☁️ Cloud Computing
  { text: "What are the differences between IaaS, PaaS, and SaaS?", field: "Cloud Computing", answer: "IaaS (Infrastructure as a Service): Provides networking, storage, servers (user manages OS/apps, e.g., AWS EC2). PaaS (Platform as a Service): Provides OS, runtime, middleware (user manages applications, e.g., AWS Elastic Beanstalk). SaaS (Software as a Service): Provides a complete application (user only manages usage, e.g., Gmail, Salesforce)." },
  { text: "What is serverless computing?", field: "Cloud Computing", answer: "Serverless computing allows developers to build and run applications without managing servers. The cloud provider dynamically manages the server allocation, scaling, and capacity (e.g., AWS Lambda, Google Cloud Functions)." },
  { text: "Explain horizontal vs vertical scaling in the cloud.", field: "Cloud Computing", answer: "Vertical scaling (scaling up) means adding more power (CPU, RAM) to an existing server. Horizontal scaling (scaling out) means adding more servers/instances to distribute the load." },
  { text: "What are cloud load balancers and why are they used?", field: "Cloud Computing", answer: "Load balancers distribute incoming network traffic across a group of backend servers (or resources). They ensure high availability and reliability by preventing any single server from becoming a bottleneck." },
  { text: "Explain cloud security best practices.", field: "Cloud Computing", answer: "Best practices include: using the principle of least privilege (IAM), encryption in transit and at rest, regular vulnerability scanning, and multi-factor authentication (MFA)." },
  { text: "What is containerization and how does Docker help?", field: "Cloud Computing", answer: "Containerization is packaging an application and all its dependencies into a single, isolated unit. Docker provides the platform and tooling (Docker images, Docker engine) to create, manage, and run these containers efficiently." },
  { text: "Explain Kubernetes and its role in orchestration.", field: "Cloud Computing", answer: "Kubernetes (K8s) is an open-source system for automating deployment, scaling, and management of containerized applications. It handles tasks like load balancing, storage orchestration, and self-healing." },

  // 🔐 Cybersecurity
  { text: "What is the difference between symmetric and asymmetric encryption?", field: "Cybersecurity", answer: "Symmetric encryption uses a single key for both encryption and decryption (fast, used for bulk data). Asymmetric encryption uses a public key (for encryption) and a private key (for decryption) (slower, used for secure key exchange and digital signatures)." },
  { text: "Explain what a firewall is and its types.", field: "Cybersecurity", answer: "A firewall is a network security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules. Types include packet-filtering, stateful inspection, and application-layer firewalls." },
  { text: "What are SQL injections and how can they be prevented?", field: "Cybersecurity", answer: "A SQL injection is an attack where an attacker can interfere with the queries that an application makes to its database. Prevention involves using parameterized queries (prepared statements) instead of string concatenation to build queries." },
  { text: "Describe the concept of hashing and salting passwords.", field: "Cybersecurity", answer: "Hashing converts a password into a fixed-size string (hash). Salting is adding a unique, random string to the password before hashing it. Salting prevents dictionary attacks and rainbow table attacks." },
  { text: "What is two-factor authentication (2FA)?", field: "Cybersecurity", answer: "2FA is a security method requiring two distinct forms of identification before granting access, typically combining something you know (password) with something you have (phone/token)." },
  { text: "Explain zero-day vulnerability.", field: "Cybersecurity", answer: "A zero-day vulnerability is a flaw in software that is unknown to the vendor (or for which no patch is available) and is actively being exploited by attackers." },
  { text: "What is cross-site scripting (XSS) and how to prevent it?", field: "Cybersecurity", answer: "XSS is an attack where malicious scripts are injected into trustworthy websites. Prevention involves input validation, output encoding, and setting proper HTTP headers (like Content Security Policy)." },

  // ⚙️ Operating Systems
  { text: "What is a process vs a thread?", field: "Operating Systems", answer: "A process is an instance of a program being executed, with its own address space, resources, and code. A thread is the smallest sequence of programmed instructions that can be managed independently by a scheduler, sharing the process's memory space." },
  { text: "Explain paging vs segmentation.", field: "Operating Systems", answer: "Paging divides memory into fixed-size blocks (pages and frames). Segmentation divides memory into variable-size blocks based on logical user views (code, data, stack). Paging prevents external fragmentation, while segmentation allows for better memory protection." },
  { text: "What are different types of scheduling algorithms?", field: "Operating Systems", answer: "Common algorithms include: First-Come, First-Served (FCFS), Shortest Job Next (SJN), Round Robin (RR), Priority Scheduling, and Multilevel Feedback Queue (MLFQ)." },
  { text: "Explain virtual memory.", field: "Operating Systems", answer: "Virtual memory is a memory management technique that allows a program to use more memory than is physically available in RAM. It does this by temporarily transferring data from RAM to disk storage (swapping)." },
  { text: "What is the difference between kernel mode and user mode?", field: "Operating Systems", answer: "Kernel mode (privileged mode) grants full access to hardware and is used by the operating system kernel. User mode (restricted mode) has limited access and is used by most application programs." },
  { text: "What is context switching?", field: "Operating Systems", answer: "Context switching is the process of storing the state of a process or thread so that it can be restored and execution can be resumed later, allowing multiple processes to share a single CPU." },
  { text: "What is inter-process communication (IPC)?", field: "Operating Systems", answer: "IPC is a set of techniques for the exchange of data among multiple threads in one or more processes. Methods include pipes, message queues, shared memory, and semaphores." },

  // 🤖 Artificial Intelligence / ML
  { text: "What is reinforcement learning?", field: "AI/ML", answer: "Reinforcement learning (RL) is a type of machine learning where an agent learns to make decisions by performing actions in an environment to maximize cumulative reward. It learns through trial and error." },
  { text: "Explain overfitting and underfitting.", field: "AI/ML", answer: "Overfitting occurs when a model learns the training data and noise too well, performing poorly on unseen data (high variance). Underfitting occurs when a model is too simple to capture the underlying trend (high bias)." },
  { text: "What is transfer learning?", field: "AI/ML", answer: "Transfer learning is a machine learning method where a model developed for a task is reused as the starting point for a model on a second, related task (e.g., using a pre-trained model like BERT or VGG)." },
  { text: "Describe attention mechanism in NLP models.", field: "AI/ML", answer: "The attention mechanism allows a neural network to selectively focus on specific parts of the input sequence that are most relevant to predicting the output, significantly improving performance in tasks like translation and summarization." },
  { text: "What is the difference between AI, ML, and Deep Learning?", field: "AI/ML", answer: "AI (Artificial Intelligence) is the broad field of making machines behave intelligently. ML (Machine Learning) is a subset of AI where systems learn from data. Deep Learning is a subset of ML that uses neural networks with many layers (deep networks)." },
  { text: "What are Generative Adversarial Networks (GANs)?", field: "AI/ML", answer: "GANs consist of two neural networks, a Generator and a Discriminator, competing against each other. The Generator creates fake data, and the Discriminator tries to distinguish it from real data, leading to realistic generation over time." },
  { text: "Explain reinforcement learning with an example (Q-learning).", field: "AI/ML", answer: "Q-learning is a model-free RL algorithm that seeks to learn an action-value function, Q(s, a), which predicts the maximum discounted future reward for taking action 'a' in state 's'." },

  // 🌐 Networking
  { text: "What is the difference between TCP and UDP?", field: "Networking", answer: "TCP (Transmission Control Protocol) is connection-oriented, reliable (guarantees delivery and order), and slower (used for web traffic, email). UDP (User Datagram Protocol) is connectionless, unreliable (no delivery guarantee), and faster (used for streaming, gaming)." },
  { text: "Explain OSI model layers.", field: "Networking", answer: "The OSI (Open Systems Interconnection) model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application. It provides a standardized way to describe how network communication works." },
  { text: "What is DNS and how does it work?", field: "Networking", answer: "DNS (Domain Name System) translates human-readable domain names (like google.com) into machine-readable IP addresses. It works through a hierarchical, decentralized system of servers." },
  { text: "Explain IP addressing (IPv4 vs IPv6).", field: "Networking", answer: "IPv4 uses 32-bit addresses (e.g., 192.168.1.1). IPv6 uses 128-bit addresses (e.g., 2001:0db8::8a2e:0370:7334), providing a vastly larger address space due to IPv4 address exhaustion." },
  { text: "What is a subnet mask?", field: "Networking", answer: "A subnet mask is a 32-bit number used to divide an IP address into two parts: the network address and the host address. It determines which portion of an IP address refers to the network and which refers to the specific machine." },
  { text: "What is ARP (Address Resolution Protocol)?", field: "Networking", answer: "ARP is a protocol used to map a known IP address to a physical machine's MAC (Media Control) address within a local network." },

  // ⚡ DevOps
  { text: "What is Continuous Integration and Continuous Deployment (CI/CD)?", field: "DevOps", answer: "CI (Continuous Integration) is the practice of frequently merging code changes into a central repository. CD (Continuous Deployment) is the practice of automatically deploying every change that passes all tests to production." },
  { text: "Explain Infrastructure as Code (IaC).", field: "DevOps", answer: "IaC is the managing and provisioning of infrastructure (networks, virtual machines, load balancers) through code, rather than manual processes. Tools like Terraform and Ansible are used." },
  { text: "What is Docker and how is it different from a virtual machine?", field: "DevOps", answer: "Docker is a containerization platform. Unlike a VM, which includes a full guest OS, a Docker container shares the host OS kernel, making it much lighter, faster to start, and more resource-efficient." },
  { text: "What is Kubernetes and why is it used?", field: "DevOps", answer: "Kubernetes is a container orchestration system used to automate the deployment, scaling, and management of containerized applications, especially microservices." },
  { text: "Explain the role of monitoring in DevOps (Prometheus, Grafana).", field: "DevOps", answer: "Monitoring is crucial for visibility into application health and performance. Tools like Prometheus (data collection/alerting) and Grafana (visualization) help identify issues proactively and verify deployments." },

  // 📱 Mobile Development
  { text: "What is the difference between React Native and Flutter?", field: "Mobile Development", answer: "React Native uses JavaScript/React to build native apps with native components. Flutter uses Dart and its own rendering engine (Skia) to draw custom widgets, offering a more consistent UI across platforms." },
  { text: "How does Android activity lifecycle work?", field: "Mobile Development", answer: "An activity goes through states: onCreate, onStart, onResume, onPause, onStop, and onDestroy, representing different stages of its life from creation to destruction." },
  { text: "Explain the difference between native apps and hybrid apps.", field: "Mobile Development", answer: "Native apps are built using the language specific to the platform (Swift/Kotlin). Hybrid apps are built using web technologies (HTML/CSS/JS) and run inside a native container (like WebView)." },
  { text: "What are fragments in Android?", field: "Mobile Development", answer: "Fragments represent a behavior or a portion of user interface in an Activity. They enable the creation of flexible and reusable UI components, especially for different screen sizes." },
  { text: "Explain SwiftUI and its advantages over UIKit.", field: "Mobile Development", answer: "SwiftUI is Apple's declarative UI framework, requiring less code and offering real-time previews. UIKit is the older, imperative framework. SwiftUI simplifies complex layouts and state management." },

  // 🏗️ System Design
  { text: "How would you design a URL shortener like bit.ly?", field: "System Design", answer: "Key components include a hash generator (to create the short ID), a distributed database (to store the mapping of short ID to long URL), and a redirection service (using HTTP 301/302). It requires careful consideration of uniqueness and scalability." },
  { text: "Explain load balancing in system design.", field: "System Design", answer: "Load balancing is distributing incoming application traffic across multiple backend services (servers). This increases throughput, improves response time, and ensures high availability/fault tolerance." },
  { text: "How would you design a chat application like WhatsApp?", field: "System Design", answer: "Requires a persistent connection mechanism (WebSockets/long polling), a scalable backend (microservices), message queues for asynchronous delivery, and end-to-end encryption for security." },
  { text: "What are message queues and why are they important?", field: "System Design", answer: "Message queues (like Kafka or RabbitMQ) provide an asynchronous communication protocol. They decouple microservices, buffer tasks, and ensure reliability by storing messages until they are processed." },
  { text: "Explain caching strategies in system design.", field: "System Design", answer: "Strategies include 'Cache-Aside' (application is responsible for reading/writing to cache), 'Read-Through,' and 'Write-Through.' Decisions depend on read/write heavy nature of the service and staleness tolerance." },

  // 🧮 Aptitude / Problem Solving
  { text: "How do you solve problems involving permutations and combinations?", field: "Aptitude", answer: "Permutations deal with the number of ways to arrange items where order matters ($$nPr$$). Combinations deal with the number of ways to select items where order does not matter ($$nCr$$). Determine if arrangement or selection is key." },
  { text: "What is the probability of drawing two aces from a deck?", field: "Aptitude", answer: "Probability of first ace: $$4/52$$. Probability of second ace (given first was drawn): $$3/51$$. Total probability: $$(4/52) \times (3/51) = 12/2652 \approx 0.0045$$" },
  { text: "A train travels 120 km in 2 hours. What is its average speed?", field: "Aptitude", answer: "Average Speed = Total Distance / Total Time. Speed = $$120 \\text{ km} / 2 \\text{ hours} = 60 \\text{ km/hr}$$. " },
  { text: "Solve: If $$3x + 5 = 20$$, what is $$x$$?", field: "Aptitude", answer: "Subtract 5 from both sides: $$3x = 15$$. Divide by 3: $$x = 5$$. " },
  { text: "What is the difference between simple and compound interest?", field: "Aptitude", answer: "Simple interest is calculated only on the principal amount. Compound interest is calculated on the principal amount and the accumulated interest of previous periods." },
];


// Determine all unique fields for the filter buttons
const allFields = ["All Fields", ...new Set(initialQuestions.map(q => q.field))];


const InterviewQuestions = () => {
  const [selectedField, setSelectedField] = useState(allFields[0]);
  const [questions] = useState(initialQuestions); // Static source data
  const [visible, setVisible] = useState([]);
  const [openAnswerIndex, setOpenAnswerIndex] = useState(null); // State to track the index of the currently open answer

  // Function to toggle answer visibility (Accordion logic)
  const toggleAnswer = (index) => {
    setOpenAnswerIndex(openAnswerIndex === index ? null : index);
  };

  // Use useMemo to filter questions based on the selected field
  const filteredQuestions = useMemo(() => {
    if (selectedField === "All Fields") {
      return questions;
    }
    return questions.filter(q => q.field === selectedField);
  }, [selectedField, questions]);

  // Handle the staggered animation when the filter changes
  useEffect(() => {
    // Reset visible index and close all answers when field changes
    setVisible([]);
    setOpenAnswerIndex(null);
    
    // Staggered animation for new content
    filteredQuestions.forEach((_, i) => {
      setTimeout(() => {
        setVisible((v) => [...v, i]);
      }, i * 60);
    });
    
    // Cleanup function
    return () => setVisible([]);
  }, [filteredQuestions]);


  return (
  // Outer container scrollable
  <div className="h-screen overflow-y-auto bg-gray-900 font-sans scrollbar-hide">
    <div className="max-w-6xl mx-auto py-16 pb-32">
      <h2 className="text-6xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500 tracking-tight drop-shadow-lg">
        <span className="block sm:inline">Tech Interview</span> Prep Hub
      </h2>
      <p className="text-center text-gray-400 mb-12 text-xl font-light">
        Select a field to focus on specialized knowledge.
      </p>

      {/* --- Field Filter Bar (Sticky) --- */}
      <div className="sticky top-0 z-20 pt-4 pb-6 bg-gray-900/95 backdrop-blur-md">
        <div className="flex justify-center">
          <nav className="flex gap-3 overflow-x-auto whitespace-nowrap p-3 bg-gray-800 rounded-3xl shadow-2xl border border-gray-700/50 scrollbar-hide">
            {allFields.map((field) => (
              <button
                key={field}
                onClick={() => setSelectedField(field)}
                className={`flex-shrink-0 px-6 py-2 text-sm font-bold rounded-2xl transition-all duration-300 transform 
                  ${
                    selectedField === field
                      ? "bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-xl shadow-indigo-500/30 scale-105"
                      : "bg-gray-700 text-gray-300 hover:bg-teal-700 hover:text-white hover:scale-[1.03]"
                  }`}
              >
                {field}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/* --- End Filter Bar --- */}

      {/* Question cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {filteredQuestions.map((q, i) => {
          const isAnswerOpen = openAnswerIndex === i;
          return (
            <div
              key={q.text + q.field}
              className={`
                relative overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 shadow-xl group cursor-pointer 
                transition-all duration-500 ease-out
                ${visible.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                ${
                  isAnswerOpen
                    ? "shadow-2xl shadow-teal-500/20 ring-4 ring-teal-500/50"
                    : "hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.01]"
                }
              `}
              onClick={() => toggleAnswer(i)}
            >
              <div className="h-1 bg-gradient-to-r from-teal-400 to-indigo-500" />
              <div className="p-6">
                <span className="text-teal-400 font-semibold text-xs uppercase tracking-widest">{q.field}</span>
                <p className="mt-3 text-gray-50 font-medium text-lg min-h-[60px]">{q.text}</p>

                {/* Answer Section */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isAnswerOpen ? "max-h-96 mt-4" : "max-h-0 mt-0"
                  }`}
                >
                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="font-bold text-teal-300 mb-2 text-sm">ANSWER:</h4>
                    <p
                      className="text-gray-300 text-base leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: q.answer.replace(
                          /\$\$(.*?)\$\$/g,
                          (match, p1) => `\\(\\displaystyle ${p1}\\)`
                        ),
                      }}
                    />
                  </div>
                </div>

                <button className="mt-4 flex items-center px-4 py-1.5 bg-indigo-700/50 text-indigo-300 text-xs font-semibold rounded-full hover:bg-indigo-700 transition pointer-events-none">
                  {isAnswerOpen ? "Hide Answer" : "View Answer"}
                  <svg
                    className={`ml-2 w-3 h-3 transition-transform duration-300 ${
                      isAnswerOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredQuestions.length === 0 && (
        <div className="text-center py-20 bg-gray-800/80 rounded-2xl shadow-inner border border-gray-700 mt-8">
          <p className="text-xl text-gray-400">No questions found for this field.</p>
        </div>
      )}
    </div>

    {/* Decorative Orbs */}
    <div className="fixed top-20 -right-16 w-64 h-64 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
    <div className="fixed bottom-20 -left-16 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

    <style>{`
      @keyframes blob {
        0%   { transform: translate(0, 0) scale(1); }
        33%  { transform: translate(30px, -50px) scale(1.1); }
        66%  { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0, 0) scale(1); }
      }
      .animate-blob { animation: blob 7s infinite; }
      .animation-delay-2000 { animation-delay: 2s; }
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  </div>
);
};

export default InterviewQuestions;
