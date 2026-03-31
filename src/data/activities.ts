import { ProgramDay } from "@/types/activity";

export function getDayById(id: string): ProgramDay | undefined {
  return program.find((day) => day.id === id);
}

export const program: ProgramDay[] = [
  {
    id: "torsdag",
    date: "30. juli",
    label: "Torsdag",
    activities: [
      {
        title: "Ankomst",
        subItems: [
          "Informasjonssenteret på skolen åpner kl. 16.00",
          "Mulighet for egentrening, både sprint og skog",
        ],
      },
    ],
  },
  {
    id: "fredag",
    date: "31. juli",
    label: "Fredag",
    activities: [
      {
        title: "Hovedankomst",
        subItems: ["Mulighet for egentrening, både sprint og skog"],
      },
    ],
  },
  {
    id: "lordag",
    date: "1. august",
    label: "Lørdag",
    activities: [
      {
        title: "Hovedløpet lang - Maridalen",
        url: "https://eventor.orientering.no/Events/Show/19382",
      },
    ],
  },
  {
    id: "sondag",
    date: "2. august",
    label: "Søndag",
    activities: [
      {
        title: "Hovedløpet sprint - Nydalen",
        url: "https://eventor.orientering.no/Events/Show/19383",
      },
    ],
  },
  {
    id: "mandag",
    date: "3. august",
    label: "Mandag",
    activities: [
      {
        title: "Aktivitetsdag, Sognsvann",
        subItems: ["Aktivitetsløype", "Bading", "Moroløp", "Disco!"],
      },
    ],
  },
  {
    id: "tirsdag",
    date: "4. august",
    label: "Tirsdag",
    activities: [
      {
        title: "Treningsdag",
        subItems: ["Innendørs-O", "O-teknisk trening skog"],
      },
    ],
  },
  {
    id: "onsdag",
    date: "5. august",
    label: "Onsdag",
    activities: [
      {
        title: "Kretsstafett",
        url: "https://eventor.orientering.no/Events/Show/20170",
      },
      {
        title: "Avreise",
        description: "Omtrent kl. 14:00",
      },
    ],
  },
];
