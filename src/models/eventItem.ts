export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  venueName: string;
  venueUrl: string;
  eventUrl: string;
  eventUrlText: string;
  description: any;
  flyer: {
    responsiveImage: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
  };
}
