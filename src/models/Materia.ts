

import type { Nota } from "./Nota";


export interface Materia {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
  notas?: Nota[];
}
