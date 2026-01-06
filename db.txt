[
  {
    "table_name": "admin_users",
    "column_name": "username",
    "data_type": "character varying",
    "constraint_type": "UNIQUE"
  },
  {
    "table_name": "admin_users",
    "column_name": "email",
    "data_type": "character varying",
    "constraint_type": "UNIQUE"
  },
  {
    "table_name": "admin_users",
    "column_name": "password",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "admin_users",
    "column_name": "full_name",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "admin_users",
    "column_name": "role",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "admin_users",
    "column_name": "is_active",
    "data_type": "boolean",
    "constraint_type": null
  },
  {
    "table_name": "admin_users",
    "column_name": "last_login",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "admin_users",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "admin_users",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "admin_users",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "categories",
    "column_name": "name",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "categories",
    "column_name": "name_uz_latin",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "categories",
    "column_name": "name_uz_cyrillic",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "categories",
    "column_name": "name_ru",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "categories",
    "column_name": "icon",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "categories",
    "column_name": "key",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "categories",
    "column_name": "is_active",
    "data_type": "boolean",
    "constraint_type": null
  },
  {
    "table_name": "categories",
    "column_name": "total_masters",
    "data_type": "integer",
    "constraint_type": null
  },
  {
    "table_name": "categories",
    "column_name": "active_orders",
    "data_type": "integer",
    "constraint_type": null
  },
  {
    "table_name": "categories",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "categories",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "categories",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "chat_messages",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "chat_messages",
    "column_name": "room_id",
    "data_type": "uuid",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "sender_type",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "sender_id",
    "data_type": "uuid",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "message_type",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "message_text",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "attachment_url",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "attachment_type",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "attachment_size",
    "data_type": "integer",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "latitude",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "longitude",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "location_address",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "is_read",
    "data_type": "boolean",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "read_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "is_deleted",
    "data_type": "boolean",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "deleted_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "reply_to_message_id",
    "data_type": "uuid",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "chat_messages",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "chat_rooms",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "chat_rooms",
    "column_name": "order_id",
    "data_type": "uuid",
    "constraint_type": "UNIQUE"
  },
  {
    "table_name": "chat_rooms",
    "column_name": "user_id",
    "data_type": "uuid",
    "constraint_type": null
  },
  {
    "table_name": "chat_rooms",
    "column_name": "master_id",
    "data_type": "uuid",
    "constraint_type": null
  },
  {
    "table_name": "chat_rooms",
    "column_name": "is_active",
    "data_type": "boolean",
    "constraint_type": null
  },
  {
    "table_name": "chat_rooms",
    "column_name": "last_message_text",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "chat_rooms",
    "column_name": "last_message_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "chat_rooms",
    "column_name": "last_message_sender_type",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "chat_rooms",
    "column_name": "user_unread_count",
    "data_type": "integer",
    "constraint_type": null
  },
  {
    "table_name": "chat_rooms",
    "column_name": "master_unread_count",
    "data_type": "integer",
    "constraint_type": null
  },
  {
    "table_name": "chat_rooms",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "chat_rooms",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "earnings",
    "column_name": "amount",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "earnings",
    "column_name": "commission",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "earnings",
    "column_name": "net_earnings",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "earnings",
    "column_name": "status",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "earnings",
    "column_name": "earned_date",
    "data_type": "date",
    "constraint_type": null
  },
  {
    "table_name": "earnings",
    "column_name": "paid_date",
    "data_type": "date",
    "constraint_type": null
  },
  {
    "table_name": "earnings",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "earnings",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "earnings",
    "column_name": "master_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "earnings",
    "column_name": "order_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "earnings",
    "column_name": "payment_id",
    "data_type": "uuid",
    "constraint_type": null
  },
  {
    "table_name": "master_availability",
    "column_name": "day_of_week",
    "data_type": "integer",
    "constraint_type": null
  },
  {
    "table_name": "master_availability",
    "column_name": "start_time",
    "data_type": "time without time zone",
    "constraint_type": null
  },
  {
    "table_name": "master_availability",
    "column_name": "end_time",
    "data_type": "time without time zone",
    "constraint_type": null
  },
  {
    "table_name": "master_availability",
    "column_name": "is_available",
    "data_type": "boolean",
    "constraint_type": null
  },
  {
    "table_name": "master_availability",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "master_availability",
    "column_name": "master_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "master_portfolio",
    "column_name": "image_url",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "master_portfolio",
    "column_name": "title",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "master_portfolio",
    "column_name": "description",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "master_portfolio",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "master_portfolio",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "master_portfolio",
    "column_name": "master_id",
    "data_type": "uuid",
    "constraint_type": null
  },
  {
    "table_name": "master_portfolio",
    "column_name": "order_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "master_services",
    "column_name": "service_name",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "master_services",
    "column_name": "description",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "master_services",
    "column_name": "price",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "master_services",
    "column_name": "duration",
    "data_type": "integer",
    "constraint_type": null
  },
  {
    "table_name": "master_services",
    "column_name": "hashtags",
    "data_type": "ARRAY",
    "constraint_type": null
  },
  {
    "table_name": "master_services",
    "column_name": "availability",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "master_services",
    "column_name": "is_available",
    "data_type": "boolean",
    "constraint_type": null
  },
  {
    "table_name": "master_services",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "master_services",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "master_services",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "master_services",
    "column_name": "category_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "master_services",
    "column_name": "master_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "masters",
    "column_name": "phone",
    "data_type": "character varying",
    "constraint_type": "UNIQUE"
  },
  {
    "table_name": "masters",
    "column_name": "backup_phone",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "username",
    "data_type": "character varying",
    "constraint_type": "UNIQUE"
  },
  {
    "table_name": "masters",
    "column_name": "password",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "full_name",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "avatar_url",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "bio",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "profession",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "experience_years",
    "data_type": "integer",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "hourly_rate",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "is_verified",
    "data_type": "boolean",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "is_insured",
    "data_type": "boolean",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "is_pro",
    "data_type": "boolean",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "is_24_7_available",
    "data_type": "boolean",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "rating",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "review_count",
    "data_type": "integer",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "completed_jobs",
    "data_type": "integer",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "response_rate",
    "data_type": "integer",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "completion_rate",
    "data_type": "integer",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "total_earned",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "passport_serial",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "passport_number",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "passport_issue_date",
    "data_type": "date",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "passport_issued_by",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "passport_photo_url",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "address",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "latitude",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "longitude",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "status",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "is_available",
    "data_type": "boolean",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "availability_status",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "fcm_token",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "language",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "registration_date",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "last_login",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "masters",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "masters",
    "column_name": "category_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "notifications",
    "column_name": "user_type",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "notifications",
    "column_name": "type",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "notifications",
    "column_name": "title",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "notifications",
    "column_name": "message",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "notifications",
    "column_name": "data",
    "data_type": "jsonb",
    "constraint_type": null
  },
  {
    "table_name": "notifications",
    "column_name": "is_read",
    "data_type": "boolean",
    "constraint_type": null
  },
  {
    "table_name": "notifications",
    "column_name": "priority",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "notifications",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "notifications",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "notifications",
    "column_name": "user_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "notifications",
    "column_name": "master_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "orders",
    "column_name": "order_number",
    "data_type": "character varying",
    "constraint_type": "UNIQUE"
  },
  {
    "table_name": "orders",
    "column_name": "client_name",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "client_phone",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "client_avatar",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "master_name",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "master_profession",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "service_name",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "service_description",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "category_name",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "scheduled_date",
    "data_type": "date",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "scheduled_time",
    "data_type": "time without time zone",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "duration_hours",
    "data_type": "integer",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "address",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "apartment_number",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "latitude",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "longitude",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "base_price",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "materials_cost",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "additional_charges",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "total_price",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "commission_rate",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "commission_amount",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "status",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "payment_status",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "user_notes",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "master_notes",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "notes",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "cancel_reason",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "accepted_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "started_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "completed_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "cancelled_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "rating",
    "data_type": "integer",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "review",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "review_created_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "review_photos",
    "data_type": "ARRAY",
    "constraint_type": null
  },
  {
    "table_name": "orders",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "orders",
    "column_name": "user_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "orders",
    "column_name": "master_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "orders",
    "column_name": "category_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "payments",
    "column_name": "transaction_id",
    "data_type": "character varying",
    "constraint_type": "UNIQUE"
  },
  {
    "table_name": "payments",
    "column_name": "amount",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "payments",
    "column_name": "commission",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "payments",
    "column_name": "master_earnings",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "payments",
    "column_name": "payment_method",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "payments",
    "column_name": "payment_gateway_id",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "payments",
    "column_name": "status",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "payments",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "payments",
    "column_name": "completed_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "payments",
    "column_name": "refunded_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "payments",
    "column_name": "payment_metadata",
    "data_type": "jsonb",
    "constraint_type": null
  },
  {
    "table_name": "payments",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "payments",
    "column_name": "order_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "payments",
    "column_name": "user_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "payments",
    "column_name": "master_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "reviews",
    "column_name": "rating",
    "data_type": "integer",
    "constraint_type": null
  },
  {
    "table_name": "reviews",
    "column_name": "comment",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "reviews",
    "column_name": "photos",
    "data_type": "ARRAY",
    "constraint_type": null
  },
  {
    "table_name": "reviews",
    "column_name": "status",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "reviews",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "reviews",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "reviews",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "reviews",
    "column_name": "user_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "reviews",
    "column_name": "master_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "reviews",
    "column_name": "order_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "settings",
    "column_name": "setting_key",
    "data_type": "character varying",
    "constraint_type": "UNIQUE"
  },
  {
    "table_name": "settings",
    "column_name": "setting_value",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "settings",
    "column_name": "setting_type",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "settings",
    "column_name": "description",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "settings",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "settings",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "spent_history",
    "column_name": "amount",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "spent_history",
    "column_name": "description",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "spent_history",
    "column_name": "spent_date",
    "data_type": "date",
    "constraint_type": null
  },
  {
    "table_name": "spent_history",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "spent_history",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "spent_history",
    "column_name": "user_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "spent_history",
    "column_name": "order_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "user_addresses",
    "column_name": "address_name",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "user_addresses",
    "column_name": "full_address",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "user_addresses",
    "column_name": "apartment",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "user_addresses",
    "column_name": "latitude",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "user_addresses",
    "column_name": "longitude",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "user_addresses",
    "column_name": "is_default",
    "data_type": "boolean",
    "constraint_type": null
  },
  {
    "table_name": "user_addresses",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "user_addresses",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "user_addresses",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "user_addresses",
    "column_name": "user_id",
    "data_type": "uuid",
    "constraint_type": "FOREIGN KEY"
  },
  {
    "table_name": "users",
    "column_name": "phone",
    "data_type": "character varying",
    "constraint_type": "UNIQUE"
  },
  {
    "table_name": "users",
    "column_name": "phone",
    "data_type": "character varying",
    "constraint_type": "UNIQUE"
  },
  {
    "table_name": "users",
    "column_name": "phone",
    "data_type": "character varying",
    "constraint_type": "UNIQUE"
  },
  {
    "table_name": "users",
    "column_name": "phone",
    "data_type": "character varying",
    "constraint_type": "UNIQUE"
  },
  {
    "table_name": "users",
    "column_name": "full_name",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "users",
    "column_name": "avatar_url",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "users",
    "column_name": "pin_code",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "users",
    "column_name": "fcm_token",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "users",
    "column_name": "language",
    "data_type": "character varying",
    "constraint_type": null
  },
  {
    "table_name": "users",
    "column_name": "is_active",
    "data_type": "boolean",
    "constraint_type": null
  },
  {
    "table_name": "users",
    "column_name": "is_blocked",
    "data_type": "boolean",
    "constraint_type": null
  },
  {
    "table_name": "users",
    "column_name": "total_orders",
    "data_type": "integer",
    "constraint_type": null
  },
  {
    "table_name": "users",
    "column_name": "total_spent",
    "data_type": "numeric",
    "constraint_type": null
  },
  {
    "table_name": "users",
    "column_name": "registration_date",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "users",
    "column_name": "last_login",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "users",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "users",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "constraint_type": null
  },
  {
    "table_name": "users",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "users",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "users",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "users",
    "column_name": "id",
    "data_type": "uuid",
    "constraint_type": "PRIMARY KEY"
  },
  {
    "table_name": "users",
    "column_name": "device_id",
    "data_type": "text",
    "constraint_type": null
  },
  {
    "table_name": "users",
    "column_name": "device_info",
    "data_type": "jsonb",
    "constraint_type": null
  },
  {
    "table_name": "users",
    "column_name": "email",
    "data_type": "text",
    "constraint_type": null
  }
]