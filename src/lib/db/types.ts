export type Customer = {
  id: string;
  slug: string;
  template_id: string;
  recipient_name: string;
  message: string | null;
  music_url: string | null;
  image_limit: number;
  created_at: string;
};

export type CustomerImage = {
  id: string;
  customer_id: string;
  storage_path: string;
  order_index: number;
  caption: string | null;
  url: string;
};

export type CustomerListRow = Customer & {
  image_count: number;
};
