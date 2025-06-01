import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  noPadding?: boolean;
}

export const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = "",
  bodyClassName = "",
  headerClassName = "",
  footerClassName = "",
  noPadding = false,
}: CardProps) => {
  return (
    <div
      className={`
      bg-[#e7e0d5] rounded-2xl overflow-hidden
      shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]
      hover:shadow-[2px_2px_12px_rgba(122,35,35,0.15)]
      transition-all duration-300
      ${className}
    `}
    >
      {(title || subtitle) && (
        <div
          className={`px-6 py-4 border-b border-[#7a2323]/10 ${headerClassName}`}
        >
          {title && (
            <h3 className="text-xl font-serif text-[#7a2323]">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-[#7a2323]/70">{subtitle}</p>
          )}
        </div>
      )}

      <div className={`${noPadding ? "" : "px-6 py-4"} ${bodyClassName}`}>
        {children}
      </div>

      {footer && (
        <div
          className={`px-6 py-4 bg-[#f5ede6] border-t border-[#7a2323]/10 ${footerClassName}`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
