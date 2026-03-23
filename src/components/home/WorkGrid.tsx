import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const PROJECTS = [
  {
    title: 'Vaultly',
    category: 'SaaS · Web App',
    year: '2026',
    gradient: 'from-emerald-900/40 to-cyan-900/20',
  },
  {
    title: 'Forma UI',
    category: 'Design System',
    year: '2026',
    gradient: 'from-violet-900/40 to-fuchsia-900/20',
  },
  {
    title: 'Meridian',
    category: 'Brand Identity',
    year: '2023',
    gradient: 'from-amber-900/30 to-orange-900/20',
  },
  {
    title: 'Stackwise',
    category: 'Web App · API',
    year: '2023',
    gradient: 'from-sky-900/40 to-indigo-900/20',
  },
  {
    title: 'Onyx Brand',
    category: 'Brand · Web',
    year: '2023',
    gradient: 'from-stone-800/50 to-neutral-900/30',
  },
];

function WorkCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const isLarge = index === 0 || index === 4;
  const isFull = index === 2;

  return (
    <motion.div
      className={`${
        isFull
          ? 'col-span-1 md:col-span-2'
          : isLarge
          ? 'col-span-1 md:col-span-1'
          : 'col-span-1'
      }`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        ease: EASE as unknown as number[],
        delay: index * 0.08,
      }}
    >
      <div className="group cursor-pointer">
        {/* Image container */}
        <div
          className={`relative overflow-hidden rounded-lg ${
            isFull ? 'aspect-[2/1]' : 'aspect-[4/3]'
          }`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${project.gradient} transition-transform duration-700 ease-out group-hover:scale-[1.04]`}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
            <span className="text-foreground text-2xl md:text-3xl font-display opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
              {project.title}
            </span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex justify-between items-center mt-4 px-1">
          <span className="text-sm text-muted-foreground">{project.category}</span>
          <span className="text-xs text-muted-foreground">{project.year}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function WorkGrid() {
  return (
    <section id="work" className="px-6 md:px-10 py-24 md:py-40 max-w-7xl mx-auto">
      <motion.div
        className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE as unknown as number[] }}
      >
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Selected work
          </span>
          <h2 className="font-display text-4xl md:text-6xl mt-3 leading-[1.05]">
            What we've shipped.
          </h2>
        </div>
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          View all work
          <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
        </a>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECTS.map((project, i) => (
          <WorkCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
