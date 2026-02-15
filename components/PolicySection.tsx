import React from 'react';

interface PolicySectionProps {
  id?: string;
  title: string;
  children: React.ReactNode;
  level?: 1 | 2 | 3;
}

const PolicySection: React.FC<PolicySectionProps> = ({
  id,
  title,
  children,
  level = 1,
}) => {
  const HeadingTag = `h${level + 1}` as keyof JSX.IntrinsicElements;

  const headingClasses = {
    1: 'font-serif font-bold text-text-body mt-8 mb-2',
    2: 'font-serif font-semibold text-text-body mt-6 mb-2',
    3: 'font-serif font-medium text-text-body mt-4 mb-2',
  };

  return (
    <section id={id} className="scroll-mt-24">
      <HeadingTag className={headingClasses[level]}>{title}</HeadingTag>
      <div className="text-text-muted leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
};

export default PolicySection;
