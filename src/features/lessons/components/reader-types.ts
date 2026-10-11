/** Serializable course shape the reader needs (built on the server). */
export type ReaderCourse = {
  slug: string;
  title: string;
  lessons: { slug: string; title: string; minutes: number }[];
};

export type ReaderNextLesson = { slug: string; title: string } | null;
