import React from "react";

export const RubbishBin: React.FC<{width: string, height: string, fill?: string}> = ({width, height, fill} ) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 15 32"
      fill={fill || 'currentColor'}
      stroke-width={0}
    >
      <path d="M13.155 5.215l0 0.553h-0.851l-0.804 11.319h-8.291l-0.804-11.319h-0.804v-0.552h3.532v-0.466c0-0.571 0.607-1.019 1.381-1.019h1.728c0.774 0 1.381 0.448 1.381 1.019v0.466h3.532zM5.685 4.749v0.466h3.385v-0.466c0-0.22-0.355-0.467-0.829-0.467h-1.728c-0.474 0-0.829 0.247-0.829 0.467zM10.984 16.534l0.765-10.766h-8.792l0.765 10.766h7.262zM7.63 15.348h-0.552v-8.607h0.552v8.607zM10.182 6.758l-0.573 8.607-0.551-0.037 0.573-8.607zM5.639 15.331l-0.551 0.036-0.566-8.607 0.551-0.036z" />
    </svg>
  );
}

export default RubbishBin;