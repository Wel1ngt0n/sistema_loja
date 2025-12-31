--
-- PostgreSQL database dump
--

\restrict Mg7CMgJkOyabeIcBNprtFXGaRW8HhOQrJqq7ujfyFhT78ivHttUvQDqlhPNvUCo

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_preorder_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_cashier_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_cashier_session_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sale_items DROP CONSTRAINT IF EXISTS sale_items_sale_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sale_items DROP CONSTRAINT IF EXISTS sale_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_permission_id_fkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pre_order_items DROP CONSTRAINT IF EXISTS pre_order_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pre_order_items DROP CONSTRAINT IF EXISTS pre_order_items_preorder_id_fkey;
ALTER TABLE IF EXISTS ONLY public.payments DROP CONSTRAINT IF EXISTS payments_sale_id_fkey;
ALTER TABLE IF EXISTS ONLY public.payments DROP CONSTRAINT IF EXISTS payments_cashier_session_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_device_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cashier_sessions DROP CONSTRAINT IF EXISTS cashier_sessions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cash_movements DROP CONSTRAINT IF EXISTS cash_movements_session_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cash_movements DROP CONSTRAINT IF EXISTS cash_movements_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;
DROP INDEX IF EXISTS public.ix_sessions_token_hash;
DROP INDEX IF EXISTS public.ix_devices_token_hash;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.system_settings DROP CONSTRAINT IF EXISTS system_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_pkey;
ALTER TABLE IF EXISTS ONLY public.sale_items DROP CONSTRAINT IF EXISTS sale_items_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_name_key;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.pre_orders DROP CONSTRAINT IF EXISTS pre_orders_pkey;
ALTER TABLE IF EXISTS ONLY public.pre_order_items DROP CONSTRAINT IF EXISTS pre_order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.permissions DROP CONSTRAINT IF EXISTS permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.permissions DROP CONSTRAINT IF EXISTS permissions_code_key;
ALTER TABLE IF EXISTS ONLY public.payments DROP CONSTRAINT IF EXISTS payments_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_pkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.devices DROP CONSTRAINT IF EXISTS devices_pkey;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_pkey;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_cpf_key;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.cashier_sessions DROP CONSTRAINT IF EXISTS cashier_sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.cash_movements DROP CONSTRAINT IF EXISTS cash_movements_pkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.alembic_version DROP CONSTRAINT IF EXISTS alembic_version_pkc;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sales ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sale_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.roles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.products ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.pre_orders ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.pre_order_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.permissions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payments ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.orders ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.order_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.devices ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.customers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.cashier_sessions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.cash_movements ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.audit_logs ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.user_roles;
DROP TABLE IF EXISTS public.system_settings;
DROP TABLE IF EXISTS public.sessions;
DROP SEQUENCE IF EXISTS public.sales_id_seq;
DROP TABLE IF EXISTS public.sales;
DROP SEQUENCE IF EXISTS public.sale_items_id_seq;
DROP TABLE IF EXISTS public.sale_items;
DROP SEQUENCE IF EXISTS public.roles_id_seq;
DROP TABLE IF EXISTS public.roles;
DROP TABLE IF EXISTS public.role_permissions;
DROP SEQUENCE IF EXISTS public.products_id_seq;
DROP TABLE IF EXISTS public.products;
DROP SEQUENCE IF EXISTS public.pre_orders_id_seq;
DROP TABLE IF EXISTS public.pre_orders;
DROP SEQUENCE IF EXISTS public.pre_order_items_id_seq;
DROP TABLE IF EXISTS public.pre_order_items;
DROP SEQUENCE IF EXISTS public.permissions_id_seq;
DROP TABLE IF EXISTS public.permissions;
DROP SEQUENCE IF EXISTS public.payments_id_seq;
DROP TABLE IF EXISTS public.payments;
DROP SEQUENCE IF EXISTS public.orders_id_seq;
DROP TABLE IF EXISTS public.orders;
DROP SEQUENCE IF EXISTS public.order_items_id_seq;
DROP TABLE IF EXISTS public.order_items;
DROP SEQUENCE IF EXISTS public.devices_id_seq;
DROP TABLE IF EXISTS public.devices;
DROP SEQUENCE IF EXISTS public.customers_id_seq;
DROP TABLE IF EXISTS public.customers;
DROP SEQUENCE IF EXISTS public.categories_id_seq;
DROP TABLE IF EXISTS public.categories;
DROP SEQUENCE IF EXISTS public.cashier_sessions_id_seq;
DROP TABLE IF EXISTS public.cashier_sessions;
DROP SEQUENCE IF EXISTS public.cash_movements_id_seq;
DROP TABLE IF EXISTS public.cash_movements;
DROP SEQUENCE IF EXISTS public.audit_logs_id_seq;
DROP TABLE IF EXISTS public.audit_logs;
DROP TABLE IF EXISTS public.alembic_version;
DROP TYPE IF EXISTS public.userrole;
DROP TYPE IF EXISTS public.salestatus;
DROP TYPE IF EXISTS public.productunit;
DROP TYPE IF EXISTS public.paymentmethod;
DROP TYPE IF EXISTS public.orderstatus;
DROP TYPE IF EXISTS public.orderorigin;
DROP TYPE IF EXISTS public.movementtype;
DROP TYPE IF EXISTS public.discounttype;
DROP TYPE IF EXISTS public.cashierstatus;
--
-- Name: cashierstatus; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.cashierstatus AS ENUM (
    'OPEN',
    'CLOSED'
);


ALTER TYPE public.cashierstatus OWNER TO "user";

--
-- Name: discounttype; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.discounttype AS ENUM (
    'NONE',
    'FIXED',
    'PERCENT'
);


ALTER TYPE public.discounttype OWNER TO "user";

--
-- Name: movementtype; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.movementtype AS ENUM (
    'SUPPLY',
    'WITHDRAW',
    'SALE',
    'REFUND'
);


ALTER TYPE public.movementtype OWNER TO "user";

--
-- Name: orderorigin; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.orderorigin AS ENUM (
    'TOTEM',
    'PDV'
);


ALTER TYPE public.orderorigin OWNER TO "user";

--
-- Name: orderstatus; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.orderstatus AS ENUM (
    'PENDING',
    'PREPARING',
    'READY',
    'PAID',
    'CANCELED'
);


ALTER TYPE public.orderstatus OWNER TO "user";

--
-- Name: paymentmethod; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.paymentmethod AS ENUM (
    'CASH',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'PIX'
);


ALTER TYPE public.paymentmethod OWNER TO "user";

--
-- Name: productunit; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.productunit AS ENUM (
    'UN',
    'KG',
    'G',
    'PORCAO'
);


ALTER TYPE public.productunit OWNER TO "user";

--
-- Name: salestatus; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.salestatus AS ENUM (
    'COMPLETED',
    'CANCELED'
);


ALTER TYPE public.salestatus OWNER TO "user";

--
-- Name: userrole; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.userrole AS ENUM (
    'ADMIN',
    'CASHIER',
    'KITCHEN'
);


ALTER TYPE public.userrole OWNER TO "user";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO "user";

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    actor_user_id integer,
    actor_device_id integer,
    action character varying(100) NOT NULL,
    resource character varying(50),
    entity_id character varying(50),
    before_json json,
    after_json json,
    ip_address character varying(50),
    user_agent character varying(200),
    created_at timestamp without time zone,
    user_id integer,
    resource_id character varying(50),
    details json,
    "timestamp" timestamp without time zone
);


ALTER TABLE public.audit_logs OWNER TO "user";

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.audit_logs_id_seq OWNER TO "user";

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: cash_movements; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.cash_movements (
    id integer NOT NULL,
    session_id integer NOT NULL,
    type public.movementtype NOT NULL,
    amount numeric(10,2) NOT NULL,
    reason character varying(255),
    created_at timestamp without time zone,
    created_by integer
);


ALTER TABLE public.cash_movements OWNER TO "user";

--
-- Name: cash_movements_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.cash_movements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cash_movements_id_seq OWNER TO "user";

--
-- Name: cash_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.cash_movements_id_seq OWNED BY public.cash_movements.id;


--
-- Name: cashier_sessions; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.cashier_sessions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    opened_at timestamp without time zone,
    closed_at timestamp without time zone,
    start_balance numeric(10,2),
    current_balance numeric(10,2),
    end_balance numeric(10,2),
    status public.cashierstatus NOT NULL
);


ALTER TABLE public.cashier_sessions OWNER TO "user";

--
-- Name: cashier_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.cashier_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cashier_sessions_id_seq OWNER TO "user";

--
-- Name: cashier_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.cashier_sessions_id_seq OWNED BY public.cashier_sessions.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    sort_order integer,
    active boolean
);


ALTER TABLE public.categories OWNER TO "user";

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO "user";

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    name character varying(100),
    cpf character varying(14),
    phone character varying(20),
    email character varying(100),
    created_at timestamp without time zone
);


ALTER TABLE public.customers OWNER TO "user";

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customers_id_seq OWNER TO "user";

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: devices; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.devices (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    token_hash character varying(128) NOT NULL,
    active boolean,
    created_at timestamp without time zone,
    last_seen_at timestamp without time zone,
    allowed_ip_range character varying(100),
    notes text
);


ALTER TABLE public.devices OWNER TO "user";

--
-- Name: devices_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.devices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.devices_id_seq OWNER TO "user";

--
-- Name: devices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.devices_id_seq OWNED BY public.devices.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    qty numeric(10,3) NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    notes character varying(200),
    kit_selections jsonb
);


ALTER TABLE public.order_items OWNER TO "user";

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_items_id_seq OWNER TO "user";

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    order_number character varying(20) NOT NULL,
    origin public.orderorigin NOT NULL,
    status public.orderstatus NOT NULL,
    created_at timestamp without time zone,
    ready_at timestamp without time zone,
    paid_at timestamp without time zone,
    notes text,
    device_id integer
);


ALTER TABLE public.orders OWNER TO "user";

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO "user";

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    cashier_session_id integer,
    amount numeric(10,2) NOT NULL,
    method public.paymentmethod NOT NULL,
    created_at timestamp without time zone,
    sale_id integer,
    change_amount numeric(10,2)
);


ALTER TABLE public.payments OWNER TO "user";

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payments_id_seq OWNER TO "user";

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    code character varying(100) NOT NULL,
    description character varying(200),
    active boolean
);


ALTER TABLE public.permissions OWNER TO "user";

--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.permissions_id_seq OWNER TO "user";

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: pre_order_items; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.pre_order_items (
    id integer NOT NULL,
    preorder_id integer NOT NULL,
    product_id integer NOT NULL,
    qty integer NOT NULL,
    desired_weight_kg numeric(10,3),
    final_weight_kg numeric(10,3),
    unit_price_snapshot numeric(10,2) NOT NULL,
    price_per_kg_snapshot numeric(10,2),
    estimated_line_total numeric(10,2) NOT NULL,
    final_line_total numeric(10,2),
    notes character varying(200)
);


ALTER TABLE public.pre_order_items OWNER TO "user";

--
-- Name: pre_order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.pre_order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pre_order_items_id_seq OWNER TO "user";

--
-- Name: pre_order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.pre_order_items_id_seq OWNED BY public.pre_order_items.id;


--
-- Name: pre_orders; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.pre_orders (
    id integer NOT NULL,
    customer_name character varying(100) NOT NULL,
    customer_phone character varying(20) NOT NULL,
    pickup_datetime timestamp without time zone NOT NULL,
    notes text,
    status character varying(50) NOT NULL,
    payment_preference character varying(50),
    estimated_total numeric(10,2),
    final_total numeric(10,2),
    paid_amount numeric(10,2),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.pre_orders OWNER TO "user";

--
-- Name: pre_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.pre_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pre_orders_id_seq OWNER TO "user";

--
-- Name: pre_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.pre_orders_id_seq OWNED BY public.pre_orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    category_id integer NOT NULL,
    unit public.productunit NOT NULL,
    price numeric(10,2) NOT NULL,
    active boolean,
    controls_stock boolean,
    stock_qty integer,
    available_in_totem boolean,
    image_url character varying(500),
    description text,
    is_kit boolean,
    kit_options json,
    created_at timestamp without time zone,
    featured boolean DEFAULT false,
    upsell boolean DEFAULT false,
    barcode character varying(50)
);


ALTER TABLE public.products OWNER TO "user";

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO "user";

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.role_permissions (
    role_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO "user";

--
-- Name: roles; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(200),
    is_system boolean,
    active boolean,
    created_at timestamp without time zone
);


ALTER TABLE public.roles OWNER TO "user";

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO "user";

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: sale_items; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.sale_items (
    id integer NOT NULL,
    sale_id integer NOT NULL,
    product_id integer NOT NULL,
    qty numeric(10,3) NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    notes character varying(200)
);


ALTER TABLE public.sale_items OWNER TO "user";

--
-- Name: sale_items_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.sale_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sale_items_id_seq OWNER TO "user";

--
-- Name: sale_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.sale_items_id_seq OWNED BY public.sale_items.id;


--
-- Name: sales; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.sales (
    id integer NOT NULL,
    order_id integer,
    cashier_user_id integer NOT NULL,
    cashier_session_id integer NOT NULL,
    customer_id integer,
    subtotal_value numeric(10,2),
    discount_type public.discounttype,
    discount_value numeric(10,2),
    total_value numeric(10,2),
    status public.salestatus,
    created_at timestamp without time zone,
    preorder_id integer
);


ALTER TABLE public.sales OWNER TO "user";

--
-- Name: sales_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.sales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sales_id_seq OWNER TO "user";

--
-- Name: sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.sales_id_seq OWNED BY public.sales.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.sessions (
    id character varying(36) NOT NULL,
    user_id integer NOT NULL,
    token_hash character varying(128) NOT NULL,
    ip_address character varying(45),
    user_agent character varying(200),
    created_at timestamp without time zone,
    expires_at timestamp without time zone NOT NULL,
    revoked_at timestamp without time zone,
    last_seen_at timestamp without time zone
);


ALTER TABLE public.sessions OWNER TO "user";

--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.system_settings (
    key character varying(50) NOT NULL,
    value character varying(255),
    description character varying(200),
    updated_at timestamp without time zone
);


ALTER TABLE public.system_settings OWNER TO "user";

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.user_roles (
    user_id integer NOT NULL,
    role_id integer NOT NULL
);


ALTER TABLE public.user_roles OWNER TO "user";

--
-- Name: users; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    active boolean,
    created_at timestamp without time zone,
    must_change_password boolean,
    updated_at timestamp without time zone,
    last_login_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: cash_movements id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.cash_movements ALTER COLUMN id SET DEFAULT nextval('public.cash_movements_id_seq'::regclass);


--
-- Name: cashier_sessions id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.cashier_sessions ALTER COLUMN id SET DEFAULT nextval('public.cashier_sessions_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: devices id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.devices ALTER COLUMN id SET DEFAULT nextval('public.devices_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: pre_order_items id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.pre_order_items ALTER COLUMN id SET DEFAULT nextval('public.pre_order_items_id_seq'::regclass);


--
-- Name: pre_orders id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.pre_orders ALTER COLUMN id SET DEFAULT nextval('public.pre_orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: sale_items id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sale_items ALTER COLUMN id SET DEFAULT nextval('public.sale_items_id_seq'::regclass);


--
-- Name: sales id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sales ALTER COLUMN id SET DEFAULT nextval('public.sales_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.alembic_version (version_num) FROM stdin;
2a5569b9882f
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.audit_logs (id, actor_user_id, actor_device_id, action, resource, entity_id, before_json, after_json, ip_address, user_agent, created_at, user_id, resource_id, details, "timestamp") FROM stdin;
1	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 00:55:22.930207	1	\N	{"name": "Marmita Grande", "category_id": 3, "price": 20, "unit": "UN", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": "", "is_kit": false}	2025-12-27 00:55:22.930209
2	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 00:56:51.182517	1	\N	{"name": "Frango Assado", "category_id": 2, "price": 50, "unit": "UN", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 00:56:51.182519
3	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 00:57:17.240455	1	\N	{"name": "Pernil Assado", "category_id": 2, "price": 50, "unit": "KG", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 00:57:17.240457
4	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 00:57:37.14798	1	\N	{"name": "Costelinha de porco", "category_id": 2, "price": 60, "unit": "KG", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 00:57:37.147982
5	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 00:57:47.866931	1	\N	{"name": "Alcatra", "category_id": 2, "price": 80, "unit": "KG", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 00:57:47.866934
6	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 00:58:10.860753	1	\N	{"name": "Costela Bovina Assada", "category_id": 2, "price": 60, "unit": "KG", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 00:58:10.860755
7	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 00:58:26.552494	1	\N	{"name": "Lingui\\u00e7a Assada", "category_id": 2, "price": 45, "unit": "KG", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 00:58:26.552495
8	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 00:58:40.874245	1	\N	{"name": "Sobrecoxa de Frango", "category_id": 2, "price": 35, "unit": "KG", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 00:58:40.874247
9	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 00:59:42.195476	1	\N	{"name": "Frango Recheado", "category_id": 2, "price": 70, "unit": "UN", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 00:59:42.195478
10	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 01:00:00.53587	1	\N	{"name": "Lombo Su\\u00edno Recheado", "category_id": 2, "price": 70, "unit": "UN", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 01:00:00.535872
11	\N	\N	UPDATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 01:01:34.543414	1	3	{"active": true, "available_in_totem": true, "category_id": 2, "controls_stock": false, "description": "", "featured": false, "id": 3, "image_url": null, "is_kit": false, "kit_options": null, "name": "Pernil Assado", "price": 50, "stock_qty": 0, "unit": "KG", "upsell": false}	2025-12-27 01:01:34.543416
12	\N	\N	UPDATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 01:01:40.828151	1	10	{"active": true, "available_in_totem": true, "category_id": 2, "controls_stock": false, "description": "", "featured": false, "id": 10, "image_url": null, "is_kit": false, "kit_options": null, "name": "Lombo Su\\u00edno Recheado", "price": 70, "stock_qty": 0, "unit": "KG", "upsell": false}	2025-12-27 01:01:40.828153
13	\N	\N	UPDATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 01:01:46.202028	1	8	{"active": true, "available_in_totem": true, "category_id": 2, "controls_stock": false, "description": "", "featured": false, "id": 8, "image_url": null, "is_kit": false, "kit_options": null, "name": "Sobrecoxa de Frango", "price": 35, "stock_qty": 0, "unit": "KG", "upsell": false}	2025-12-27 01:01:46.20203
14	\N	\N	UPDATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 01:01:54.880271	1	7	{"active": true, "available_in_totem": true, "category_id": 2, "controls_stock": false, "description": "", "featured": false, "id": 7, "image_url": null, "is_kit": false, "kit_options": null, "name": "Lingui\\u00e7a Assada", "price": 45, "stock_qty": 0, "unit": "KG", "upsell": false}	2025-12-27 01:01:54.880273
15	\N	\N	UPDATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 01:02:01.507291	1	6	{"active": true, "available_in_totem": true, "category_id": 2, "controls_stock": false, "description": "", "featured": false, "id": 6, "image_url": null, "is_kit": false, "kit_options": null, "name": "Costela Bovina Assada", "price": 60, "stock_qty": 0, "unit": "KG", "upsell": false}	2025-12-27 01:02:01.507292
16	\N	\N	UPDATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 01:02:12.89691	1	5	{"active": true, "available_in_totem": true, "category_id": 2, "controls_stock": false, "description": "", "featured": false, "id": 5, "image_url": null, "is_kit": false, "kit_options": null, "name": "Alcatra", "price": 80, "stock_qty": 0, "unit": "KG", "upsell": false}	2025-12-27 01:02:12.896912
17	\N	\N	UPDATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 01:02:19.240886	1	4	{"active": true, "available_in_totem": true, "category_id": 2, "controls_stock": false, "description": "", "featured": false, "id": 4, "image_url": null, "is_kit": false, "kit_options": null, "name": "Costelinha de porco", "price": 60, "stock_qty": 0, "unit": "KG", "upsell": false}	2025-12-27 01:02:19.240888
18	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 01:02:47.498769	1	\N	{"name": "Coca Cola Lata 350ml ", "category_id": 4, "price": 5, "unit": "UN", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 01:02:47.498771
19	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 01:03:02.54688	1	\N	{"name": "Coca Cola 2L", "category_id": 4, "price": 11, "unit": "UN", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 01:03:02.546882
20	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 01:03:17.679844	1	\N	{"name": "Coca Cola Zero 2L", "category_id": 4, "price": 11, "unit": "UN", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 01:03:17.679846
21	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 01:03:40.40755	1	\N	{"name": "Coca Cola Zero 350ml", "category_id": 4, "price": 0, "unit": "UN", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 01:03:40.407552
22	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 15:29:04.078206	1	\N	{"name": "Arroz", "category_id": 1, "price": 10, "unit": "UN", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 15:29:04.078208
23	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 15:29:22.811689	1	\N	{"name": "Feij\\u00e3o Tropeiro", "category_id": 2, "price": 15, "unit": "UN", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 15:29:22.811691
24	\N	\N	UPDATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 15:29:31.614499	1	14	{"active": true, "available_in_totem": true, "category_id": 4, "controls_stock": false, "description": "", "featured": false, "id": 14, "image_url": null, "is_kit": false, "kit_options": null, "name": "Coca Cola Zero 350ml", "price": 11, "stock_qty": 0, "unit": "UN", "upsell": false}	2025-12-27 15:29:31.614501
25	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 15:29:55.440467	1	\N	{"name": "Salada de Maionese", "category_id": 1, "price": 15, "unit": "UN", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 15:29:55.44047
26	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 15:30:08.759424	1	\N	{"name": "Vinagrete", "category_id": 1, "price": 15, "unit": "UN", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": true, "description": ""}	2025-12-27 15:30:08.759426
27	\N	\N	UPDATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 15:35:53.466227	1	16	{"active": true, "available_in_totem": true, "category_id": 1, "controls_stock": false, "description": "", "featured": false, "id": 16, "image_url": null, "is_kit": false, "kit_options": null, "name": "Feij\\u00e3o Tropeiro", "price": 15, "stock_qty": 0, "unit": "UN", "upsell": false}	2025-12-27 15:35:53.46623
28	\N	\N	CREATE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 15:36:18.551873	1	\N	{"name": "Feij\\u00e3o de Caldo", "category_id": 1, "price": 15, "unit": "UN", "active": true, "controls_stock": false, "stock_qty": 0, "available_in_totem": false, "description": ""}	2025-12-27 15:36:18.551874
29	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 15:49:47.742093	1	11	null	2025-12-27 15:49:47.742095
30	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 15:49:49.765493	1	12	null	2025-12-27 15:49:49.765495
31	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 15:49:51.395625	1	13	null	2025-12-27 15:49:51.395627
32	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 15:49:52.831643	1	14	null	2025-12-27 15:49:52.831645
33	\N	\N	IMPORT_PRODUCTS_CSV	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:06:23.019805	1	\N	null	2025-12-27 16:06:23.019807
34	\N	\N	IMPORT_PRODUCTS_CSV	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:08:33.098763	1	\N	null	2025-12-27 16:08:33.098765
35	\N	\N	IMPORT_PRODUCTS_CSV	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:13:05.291851	1	\N	null	2025-12-27 16:13:05.291853
36	\N	\N	IMPORT_PRODUCTS_CSV	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:27:56.656947	1	\N	null	2025-12-27 16:27:56.656949
37	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:31:22.605138	1	20	null	2025-12-27 16:31:22.60514
38	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:31:30.74003	1	22	null	2025-12-27 16:31:30.740033
39	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:31:32.917795	1	21	null	2025-12-27 16:31:32.917797
40	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:31:37.528009	1	25	null	2025-12-27 16:31:37.528011
41	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:31:44.450451	1	29	null	2025-12-27 16:31:44.450453
42	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:31:46.910537	1	30	null	2025-12-27 16:31:46.910539
43	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:31:50.365521	1	31	null	2025-12-27 16:31:50.365523
44	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:31:56.275542	1	34	null	2025-12-27 16:31:56.275544
45	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:31:58.864821	1	33	null	2025-12-27 16:31:58.864823
46	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:32:07.212862	1	42	null	2025-12-27 16:32:07.212864
47	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:35:14.174674	1	32	null	2025-12-27 16:35:14.174676
48	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:35:23.828996	1	27	null	2025-12-27 16:35:23.828999
49	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:35:36.510592	1	28	null	2025-12-27 16:35:36.510594
50	\N	\N	DELETE_PRODUCT	PRODUCT	\N	\N	\N	172.18.0.5	\N	2025-12-27 16:35:45.461196	1	24	null	2025-12-27 16:35:45.461197
\.


--
-- Data for Name: cash_movements; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.cash_movements (id, session_id, type, amount, reason, created_at, created_by) FROM stdin;
\.


--
-- Data for Name: cashier_sessions; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.cashier_sessions (id, user_id, opened_at, closed_at, start_balance, current_balance, end_balance, status) FROM stdin;
1	1	2025-12-30 19:56:26.934145	2025-12-30 19:56:32.241375	0.00	0.00	0.00	CLOSED
2	1	2025-12-30 21:16:27.06468	\N	0.00	0.00	\N	OPEN
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.categories (id, name, sort_order, active) FROM stdin;
2	Carnes	1	t
4	Bebidas	4	t
3	Marmita	2	t
1	Porções	3	t
5	Porçoes da marmita	5	f
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.customers (id, name, cpf, phone, email, created_at) FROM stdin;
\.


--
-- Data for Name: devices; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.devices (id, name, token_hash, active, created_at, last_seen_at, allowed_ip_range, notes) FROM stdin;
2	meu_totem	5496765130d18bb8aa998c98e11349cb47fbaf2e5a540c1d9e5add13e60e629e	t	2025-12-26 10:50:48.265077	2025-12-29 01:22:01.379131	\N	\N
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.order_items (id, order_id, product_id, qty, unit_price, notes, kit_selections) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.orders (id, order_number, origin, status, created_at, ready_at, paid_at, notes, device_id) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.payments (id, cashier_session_id, amount, method, created_at, sale_id, change_amount) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.permissions (id, code, description, active) FROM stdin;
1	users:manage	Permission users:manage	t
2	roles:manage	Permission roles:manage	t
3	devices:manage	Permission devices:manage	t
4	products:read	Permission products:read	t
5	products:write	Permission products:write	t
6	orders:read	Permission orders:read	t
7	orders:write	Permission orders:write	t
8	reports:view	Permission reports:view	t
\.


--
-- Data for Name: pre_order_items; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.pre_order_items (id, preorder_id, product_id, qty, desired_weight_kg, final_weight_kg, unit_price_snapshot, price_per_kg_snapshot, estimated_line_total, final_line_total, notes) FROM stdin;
3	2	10	1	1.500	\N	0.00	70.00	105.00	\N	
4	2	35	1	\N	\N	0.00	\N	0.00	\N	
5	3	10	1	1.500	\N	70.00	70.00	105.00	\N	
6	3	35	1	\N	\N	10.99	\N	10.99	\N	
7	4	10	1	1.500	\N	70.00	70.00	105.00	\N	
8	4	35	1	\N	\N	10.99	\N	10.99	\N	
10	1	2	1	\N	\N	50.00	\N	50.00	\N	
11	5	41	1	\N	\N	3.29	\N	3.29	\N	Item de teste
12	6	1	3	\N	\N	20.00	\N	60.00	\N	Item de teste
13	6	4	1	2.219	\N	60.00	60.00	133.14	\N	Item de teste
14	7	19	1	\N	\N	15.00	\N	15.00	\N	Item de teste
15	7	15	1	\N	\N	10.00	\N	10.00	\N	Item de teste
16	7	7	1	1.872	\N	45.00	45.00	84.24	\N	Item de teste
17	8	26	4	\N	\N	6.99	\N	27.96	\N	Item de teste
18	8	9	1	\N	\N	70.00	\N	70.00	\N	Item de teste
19	8	40	2	\N	\N	3.29	\N	6.58	\N	Item de teste
20	9	23	4	\N	\N	3.99	\N	15.96	\N	Item de teste
21	10	38	4	\N	\N	7.99	\N	31.96	\N	Item dia 31
22	10	2	5	\N	\N	50.00	\N	250.00	\N	Item dia 31
23	11	43	3	\N	\N	7.99	\N	23.97	\N	Item dia 31
24	11	16	2	\N	\N	15.00	\N	30.00	\N	Item dia 31
25	11	10	1	2.148	\N	70.00	70.00	150.36	\N	Item dia 31
26	12	36	5	\N	\N	5.19	\N	25.95	\N	Item dia 31
27	12	2	3	\N	\N	50.00	\N	150.00	\N	Item dia 31
28	13	8	1	2.054	\N	35.00	35.00	71.89	\N	Bem passado
29	13	5	1	3.656	\N	80.00	80.00	292.48	\N	Bem passado
30	14	3	1	3.330	\N	50.00	50.00	166.50	\N	Bem passado
31	15	10	1	2.091	\N	70.00	70.00	146.37	\N	Ao ponto
32	16	2	4	\N	\N	50.00	\N	200.00	\N	
33	16	7	1	4.398	\N	45.00	45.00	197.91	\N	Ao ponto
34	17	8	1	4.789	\N	35.00	35.00	167.61	\N	Ao ponto
35	17	4	1	3.599	\N	60.00	60.00	215.94	\N	Bem passado
36	18	3	1	2.500	\N	50.00	50.00	125.00	\N	
37	18	2	1	\N	\N	50.00	\N	50.00	\N	
38	18	35	1	\N	\N	10.99	\N	10.99	\N	
\.


--
-- Data for Name: pre_orders; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.pre_orders (id, customer_name, customer_phone, pickup_datetime, notes, status, payment_preference, estimated_total, final_total, paid_amount, created_at, updated_at) FROM stdin;
2	welington	61995515999	2025-12-31 17:00:00		DRAFT	\N	105.00	\N	0.00	2025-12-30 19:58:14.880443	2025-12-30 19:58:14.880444
3	welington	61995515999	2025-12-31 17:00:00		DRAFT	\N	115.99	\N	0.00	2025-12-30 20:02:16.249564	2025-12-30 20:02:16.249566
4	welington	61995515999	2025-12-31 17:00:00		DRAFT	\N	115.99	\N	0.00	2025-12-30 20:04:00.275417	2025-12-30 20:04:00.275419
1	welington	61995515999	2025-12-31 17:00:00		DRAFT	\N	50.00	\N	0.00	2025-12-30 19:57:20.047162	2025-12-30 20:08:16.466071
5	João Silva	11999991111	2025-12-30 14:00:00	Pedido de teste gerado automaticamente - 92	CONFIRMED	\N	3.29	\N	0.00	2025-12-30 20:13:40.511739	2025-12-30 20:13:40.511742
6	Maria Oliveira	11988882222	2025-12-30 12:00:00	Pedido de teste gerado automaticamente - 45	CONFIRMED	\N	193.14	\N	0.00	2025-12-30 20:13:40.511742	2025-12-30 20:13:40.511743
7	Carlos Souza	11977773333	2025-12-30 14:00:00	Pedido de teste gerado automaticamente - 47	CONFIRMED	\N	109.24	\N	0.00	2025-12-30 20:13:40.511743	2025-12-30 20:13:40.511743
8	Ana Pereira	11966664444	2025-12-30 14:00:00	Pedido de teste gerado automaticamente - 78	CONFIRMED	\N	104.54	\N	0.00	2025-12-30 20:13:40.511743	2025-12-30 20:13:40.511744
9	Roberto Santos	11955556666	2025-12-30 15:00:00	Pedido de teste gerado automaticamente - 24	CONFIRMED	\N	15.96	\N	0.00	2025-12-30 20:13:40.511744	2025-12-30 20:13:40.511744
10	Cliente Amanhã 1	11999991111	2025-12-31 15:00:00	Pedido extra para dia 31	CONFIRMED	\N	281.96	\N	0.00	2025-12-30 20:15:19.119584	2025-12-30 20:15:19.119586
11	Cliente Amanhã 2	11988882222	2025-12-31 18:00:00	Pedido extra para dia 31	CONFIRMED	\N	204.33	\N	0.00	2025-12-30 20:15:19.119586	2025-12-30 20:15:19.119587
12	Cliente Amanhã 3	11977773333	2025-12-31 13:00:00	Pedido extra para dia 31	CONFIRMED	\N	175.95	\N	0.00	2025-12-30 20:15:19.119587	2025-12-30 20:15:19.119587
13	Churrasco Família Souza	11911111111	2025-12-31 11:00:00	Pedido focado em carnes	CONFIRMED	\N	364.37	\N	0.00	2025-12-30 20:40:16.063693	2025-12-30 20:40:16.063696
14	Pedro Carnes	11922222222	2025-12-31 11:00:00	Pedido focado em carnes	CONFIRMED	\N	166.50	\N	0.00	2025-12-30 20:40:16.063696	2025-12-30 20:40:16.063696
15	João do Lombo	11933333333	2025-12-31 18:00:00	Pedido focado em carnes	CONFIRMED	\N	146.37	\N	0.00	2025-12-30 20:40:16.063697	2025-12-30 20:40:16.063697
16	Mariana Assados	11944444444	2025-12-31 12:00:00	Pedido focado em carnes	CONFIRMED	\N	397.91	\N	0.00	2025-12-30 20:40:16.063697	2025-12-30 20:40:16.063697
17	Festa de Ano Novo	11955555555	2025-12-31 13:00:00	Pedido focado em carnes	CONFIRMED	\N	383.55	\N	0.00	2025-12-30 20:40:16.063697	2025-12-30 20:40:16.063698
18	Welin	6282722	2025-12-31 14:30:00		DRAFT	\N	185.99	\N	0.00	2025-12-30 21:15:17.712971	2025-12-30 21:15:17.712972
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.products (id, name, category_id, unit, price, active, controls_stock, stock_qty, available_in_totem, image_url, description, is_kit, kit_options, created_at, featured, upsell, barcode) FROM stdin;
1	Marmita Grande	3	UN	20.00	t	f	0	t	\N		f	null	2025-12-27 00:55:22.917049	f	f	
2	Frango Assado	2	UN	50.00	t	f	0	t	\N		f	null	2025-12-27 00:56:51.173468	f	f	
3	Pernil Assado	2	KG	50.00	t	f	0	t	\N		f	null	2025-12-27 00:57:17.232404	f	f	
4	Costelinha de porco	2	KG	60.00	t	f	0	t	\N		f	null	2025-12-27 00:57:37.138255	f	f	
5	Alcatra	2	KG	80.00	t	f	0	t	\N		f	null	2025-12-27 00:57:47.859547	f	f	
6	Costela Bovina Assada	2	KG	60.00	t	f	0	t	\N		f	null	2025-12-27 00:58:10.852051	f	f	
7	Linguiça Assada	2	KG	45.00	t	f	0	t	\N		f	null	2025-12-27 00:58:26.543945	f	f	
8	Sobrecoxa de Frango	2	KG	35.00	t	f	0	t	\N		f	null	2025-12-27 00:58:40.866196	f	f	
9	Frango Recheado	2	UN	70.00	t	f	0	t	\N		f	null	2025-12-27 00:59:42.186591	f	f	
10	Lombo Suíno Recheado	2	KG	70.00	t	f	0	t	\N		f	null	2025-12-27 01:00:00.527861	f	f	
15	Arroz	1	UN	10.00	t	f	0	t	\N		f	null	2025-12-27 15:29:04.062354	f	f	
16	Feijão Tropeiro	1	UN	15.00	t	f	0	t	\N		f	null	2025-12-27 15:29:22.803873	f	f	
17	Salada de Maionese	1	UN	15.00	t	f	0	t	\N		f	null	2025-12-27 15:29:55.431946	f	f	
18	Vinagrete	1	UN	15.00	t	f	0	t	\N		f	null	2025-12-27 15:30:08.753666	f	f	
19	Feijão de Caldo	1	UN	15.00	t	f	0	t	\N		f	null	2025-12-27 15:36:18.544345	f	f	
23	Cerveja Brahma Duplo Malte Puro Malte Lata 350ml	4	UN	3.99	t	f	0	t	http://localhost:5000/static/uploads/0036dc79454249a38caffe0e2fd6c47b.jpg		f	\N	2025-12-27 16:28:00.470988	f	f	7891991294942
26	Cerveja Lager Heineken Long Neck 330ml	4	UN	6.99	t	f	0	t	http://localhost:5000/static/uploads/d9092418fd634e65bfedeae8e2963623.jpg		f	\N	2025-12-27 16:28:03.253681	f	f	78936683
35	Refrigerante Coca Cola Tradicional Garrafa 2L	4	UN	10.99	t	f	0	t	http://localhost:5000/static/uploads/228cc60fea11438d951382459371d159.jpg		f	\N	2025-12-27 16:28:10.953421	f	f	7894900027013
36	Refrigerante Coca Cola Tradicional Garrafa 600ml	4	UN	5.19	t	f	0	t	http://localhost:5000/static/uploads/b77b47f017b34b10b8eb3beb68810cef.jpg		f	\N	2025-12-27 16:28:11.981288	f	f	7894900011609
37	Refrigerante Fanta Laranja Garrafa 2L	4	UN	7.99	t	f	0	t	http://localhost:5000/static/uploads/35ca114191ec4f918b80071745271d8a.jpg		f	\N	2025-12-27 16:28:12.497548	f	f	7894900031515
38	Refrigerante Fanta Guaraná Garrafa 2L	4	UN	7.99	t	f	0	t	http://localhost:5000/static/uploads/041fcc9a62704c5fb10d1539b3bcfc0b.jpg		f	\N	2025-12-27 16:28:13.129168	f	f	7894900093056
39	Refrigerante Pepsi Tradicional Garrafa 2L	4	UN	7.69	t	f	0	t	http://localhost:5000/static/uploads/0a38b1d8cc264c9a881a95ab4c1a070c.jpg		f	\N	2025-12-27 16:28:13.812427	f	f	7892840800000
40	Refrigerante Pepsi Tradicional Lata 350ml	4	UN	3.29	t	f	0	t	http://localhost:5000/static/uploads/95651e5134fe4f1d8350e7c2bafa2758.jpg		f	\N	2025-12-27 16:28:14.650859	f	f	7892840800079
41	Refrigerante Pepsi Black Zero Açúcar Lata 350ml	4	UN	3.29	t	f	0	t	http://localhost:5000/static/uploads/bd53a5d08e3c4b39bedaa2c8864378c6.jpg		f	\N	2025-12-27 16:28:15.48299	f	f	7892840813505
43	Refrigerante Coca Cola Tradicional Garrafa 1,5L	4	UN	7.99	t	f	0	t	http://localhost:5000/static/uploads/80e8bd764f98483f892cea646e16f38f.jpg		f	\N	2025-12-27 16:28:16.841271	f	f	7894900012354
44	Refrigerante Fanta Uva Garrafa 2L	4	UN	7.99	t	f	0	t	http://localhost:5000/static/uploads/45d0ff4f84af4e478a8e6f622d02e370.jpg		f	\N	2025-12-27 16:28:17.537656	f	f	7894900051513
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.role_permissions (role_id, permission_id) FROM stdin;
1	1
1	2
1	3
1	4
1	5
1	6
1	7
1	8
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.roles (id, name, description, is_system, active, created_at) FROM stdin;
1	SUPER_ADMIN	Super Administrator - Total Control	t	t	2025-12-26 01:30:01.524942
2	ADMIN	Manager	f	t	2025-12-26 01:30:01.527574
3	CASHIER	Cashier	f	t	2025-12-26 01:30:01.528646
4	KITCHEN	Kitchen Staff	f	t	2025-12-26 01:30:01.529587
5	VIEWER	Read Only	f	t	2025-12-26 01:30:01.530423
\.


--
-- Data for Name: sale_items; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.sale_items (id, sale_id, product_id, qty, unit_price, total_price, notes) FROM stdin;
\.


--
-- Data for Name: sales; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.sales (id, order_id, cashier_user_id, cashier_session_id, customer_id, subtotal_value, discount_type, discount_value, total_value, status, created_at, preorder_id) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.sessions (id, user_id, token_hash, ip_address, user_agent, created_at, expires_at, revoked_at, last_seen_at) FROM stdin;
c2cacd9d-47ea-49db-b6a5-016dcd27f11a	1	e5ff377fd6492c901a844a841619c21e43e622222ec5b3e65677a60bdd764cf7	172.18.0.5	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-30 21:02:41.782994	2025-12-31 09:02:41.781756	\N	2025-12-30 21:02:41.782995
b0bcad44-2cf5-416d-bcf5-38e763a8c83d	1	d032a3d9cae57e8f395a982ed17ed4c1415a2874fce202a9a6b19135056fb882	172.18.0.5	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-26 17:16:12.807453	2025-12-27 05:16:12.805242	\N	2025-12-27 01:01:34.517255
ec03bc82-aad4-4cb2-a3dd-c90b5a604c39	1	fe1bd82aa2f3473c90c3aa750af8f8e32b0832dae312d532e33da0244e071831	172.18.0.4	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-26 01:54:43.853602	2025-12-26 13:54:43.852061	2025-12-26 02:10:45.912802	2025-12-26 02:10:37.254169
6f966e03-d54c-4162-8e90-8321b64af2e7	2	4840c0bcf4a6c59c0cf1e9d46b74ae8e766db53e9753c24727c1073356f5cc47	172.18.0.4	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-26 02:13:58.708304	2025-12-26 14:13:58.706565	2025-12-26 02:14:16.507085	2025-12-26 02:13:58.708305
61c14138-2ff9-40c3-af0b-06c60f0e58bc	1	d2aadcc52f7abea1dce553d8c189d42b3b3a9612bfd2edc880f06d8a894f7515	172.18.0.5	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-30 19:56:08.904865	2025-12-31 07:56:08.903494	2025-12-30 21:03:27.791955	2025-12-30 21:03:22.811766
07cfe976-2e4b-4544-ac44-c18236479baf	1	ea88d39a5d6476c629143bc97fbea54ee0b6d4ee32371b375b0c8966c447886d	172.18.0.4	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-26 02:14:19.290964	2025-12-26 14:14:19.290471	2025-12-26 10:42:55.99428	2025-12-26 10:42:50.611588
61ae22a4-b502-4f48-9c66-8a3a7d4054f5	1	4d40e5e52cf8338130fa8d5bd9fffb388bc6623930c79337e43d8734b3f6448f	172.18.0.5	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-30 21:03:34.374337	2025-12-31 09:03:34.373197	\N	2025-12-30 21:03:34.374339
f02d8887-1fe5-486e-9ddc-b10c4166407a	1	741d12655c4149cc25a2b5aefb5f907bb1eabbabeaba6f5e40e4b6dc8dec6654	172.18.0.4	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-26 13:55:14.865344	2025-12-27 01:55:14.864184	\N	2025-12-26 17:15:53.297041
010d5580-161b-479b-91ce-4fd27d7c5bfa	1	56108910473a61c2097e3bb68ee21f6b077805a33a80cc7b4d39dbd92d0196af	172.18.0.4	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-26 10:42:57.959804	2025-12-26 22:42:57.958611	\N	2025-12-26 11:40:00.908533
5b600bca-61a7-49ad-83df-a868dd376867	1	e2c9d4b016aad416a2ef6203a4c377f407fd186dbc9508b7503d31612fa4c5e7	172.18.0.5	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-30 21:07:58.092944	2025-12-31 09:07:58.092443	\N	2025-12-30 21:07:58.092945
bcd2621c-417c-4c5e-a8e3-13c6139cbc94	1	9bb9da92e6f1ab8e7c323424504a89e6f24a1e596dcfa8c38677a7045f67f22b	172.18.0.5	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	2025-12-30 21:08:21.856981	2025-12-31 09:08:21.856524	\N	2025-12-30 21:14:12.410473
60ed53fc-996b-48ea-b640-6513dacee1c4	1	baa4d0f79b78620447d9e7124c45196f09fe662b9d65cf296c43b2dd3590651d	172.18.0.4	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-26 11:40:04.08287	2025-12-26 23:40:04.0816	\N	2025-12-26 13:50:14.425966
36ccb72d-e840-4a49-bdd1-49ca6f4bdea2	1	319d85866f559aebd9a9761cdd80f7f6245d8577d26a09c95201687f26875f1f	172.18.0.5	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	2025-12-30 21:16:55.341307	2025-12-31 09:16:55.340836	\N	2025-12-30 21:16:55.341308
33cf0a64-a161-48b9-91a3-36bc2ece80c1	1	8f7d7c5bbe4c0d3a546663bc12164bf1a12a4d03839b6b774d6cc1078d198ba8	172.18.0.5	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-27 15:28:13.928489	2025-12-28 03:28:13.926692	\N	2025-12-27 16:40:51.669923
cd20ab5c-e11b-495c-a5ba-4ce830526275	1	882b600be31dfd4266cafa1000d9695514bd132c3294ab432cba24ba00f7c944	172.18.0.5	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-29 01:22:09.404631	2025-12-29 13:22:09.403043	\N	2025-12-29 01:22:09.404632
4e75a2fd-1277-43d7-96b3-7b482be4b78b	1	f3f50d280c3f7011fb3b240a1c4ff4b5d143b17696ea28df01a012bfe821d635	172.18.0.5	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	2025-12-30 21:17:10.155692	2025-12-31 09:17:10.155219	\N	2025-12-30 21:17:10.155693
\.


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.system_settings (key, value, description, updated_at) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.user_roles (user_id, role_id) FROM stdin;
1	1
2	2
2	3
2	4
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.users (id, name, username, password_hash, active, created_at, must_change_password, updated_at, last_login_at) FROM stdin;
2	admin	raimundo	$2b$12$SEKA4O9ibM56Kjq1rTgmE.CMDjrZcWHvcivFq3U5DGNSBVVTiGhcy	t	2025-12-26 02:10:37.453591	f	2025-12-26 02:24:46.675394	\N
1	Administrador	admin	$2b$12$LHeQwxlH5jcO/IusrA/z6O7SOHU.DVxVwx6hy5yUnaEjbAPJxxK5G	t	2025-12-25 23:16:06.292253	\N	2025-12-30 21:02:10.691981	\N
\.


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 50, true);


--
-- Name: cash_movements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.cash_movements_id_seq', 1, false);


--
-- Name: cashier_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.cashier_sessions_id_seq', 2, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.categories_id_seq', 5, true);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.customers_id_seq', 1, false);


--
-- Name: devices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.devices_id_seq', 2, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.permissions_id_seq', 8, true);


--
-- Name: pre_order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.pre_order_items_id_seq', 38, true);


--
-- Name: pre_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.pre_orders_id_seq', 18, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.products_id_seq', 44, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.roles_id_seq', 5, true);


--
-- Name: sale_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.sale_items_id_seq', 1, false);


--
-- Name: sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.sales_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: cash_movements cash_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.cash_movements
    ADD CONSTRAINT cash_movements_pkey PRIMARY KEY (id);


--
-- Name: cashier_sessions cashier_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.cashier_sessions
    ADD CONSTRAINT cashier_sessions_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: customers customers_cpf_key; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_cpf_key UNIQUE (cpf);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_code_key; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_code_key UNIQUE (code);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: pre_order_items pre_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.pre_order_items
    ADD CONSTRAINT pre_order_items_pkey PRIMARY KEY (id);


--
-- Name: pre_orders pre_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.pre_orders
    ADD CONSTRAINT pre_orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sale_items sale_items_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT sale_items_pkey PRIMARY KEY (id);


--
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (key);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: ix_devices_token_hash; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_devices_token_hash ON public.devices USING btree (token_hash);


--
-- Name: ix_sessions_token_hash; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_sessions_token_hash ON public.sessions USING btree (token_hash);


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: cash_movements cash_movements_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.cash_movements
    ADD CONSTRAINT cash_movements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: cash_movements cash_movements_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.cash_movements
    ADD CONSTRAINT cash_movements_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.cashier_sessions(id);


--
-- Name: cashier_sessions cashier_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.cashier_sessions
    ADD CONSTRAINT cashier_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id);


--
-- Name: payments payments_cashier_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_cashier_session_id_fkey FOREIGN KEY (cashier_session_id) REFERENCES public.cashier_sessions(id);


--
-- Name: payments payments_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales(id);


--
-- Name: pre_order_items pre_order_items_preorder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.pre_order_items
    ADD CONSTRAINT pre_order_items_preorder_id_fkey FOREIGN KEY (preorder_id) REFERENCES public.pre_orders(id);


--
-- Name: pre_order_items pre_order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.pre_order_items
    ADD CONSTRAINT pre_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id);


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: sale_items sale_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT sale_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: sale_items sale_items_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT sale_items_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales(id);


--
-- Name: sales sales_cashier_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_cashier_session_id_fkey FOREIGN KEY (cashier_session_id) REFERENCES public.cashier_sessions(id);


--
-- Name: sales sales_cashier_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_cashier_user_id_fkey FOREIGN KEY (cashier_user_id) REFERENCES public.users(id);


--
-- Name: sales sales_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: sales sales_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: sales sales_preorder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_preorder_id_fkey FOREIGN KEY (preorder_id) REFERENCES public.pre_orders(id);


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict Mg7CMgJkOyabeIcBNprtFXGaRW8HhOQrJqq7ujfyFhT78ivHttUvQDqlhPNvUCo

