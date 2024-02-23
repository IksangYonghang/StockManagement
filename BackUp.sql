PGDMP  '    1                |            LiquorInvMgmt    14.8    16.0 P    n           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            o           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            p           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            q           1262    310236    LiquorInvMgmt    DATABASE     �   CREATE DATABASE "LiquorInvMgmt" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "LiquorInvMgmt";
                postgres    false                        2615    322892    bill    SCHEMA        CREATE SCHEMA bill;
    DROP SCHEMA bill;
                postgres    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            r           0    0    SCHEMA public    ACL     Q   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   postgres    false    4                        2615    310242    stock    SCHEMA        CREATE SCHEMA stock;
    DROP SCHEMA stock;
                postgres    false            �            1259    322894    vatbills    TABLE     �  CREATE TABLE bill.vatbills (
    id bigint NOT NULL,
    bill_number text NOT NULL,
    date date NOT NULL,
    eng_date date NOT NULL,
    customer_name text NOT NULL,
    customer_address text NOT NULL,
    customer_vat_pan text NOT NULL,
    customer_contact text NOT NULL,
    product_name text NOT NULL,
    size integer NOT NULL,
    quantity integer NOT NULL,
    rate numeric NOT NULL,
    amount numeric NOT NULL,
    discount numeric NOT NULL,
    taxable_amount numeric NOT NULL,
    vat_rate numeric NOT NULL,
    net_amount numeric NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    product_id bigint DEFAULT 0 NOT NULL
);
    DROP TABLE bill.vatbills;
       bill         heap    postgres    false    7            �            1259    322893    vatbills_id_seq    SEQUENCE     �   ALTER TABLE bill.vatbills ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME bill.vatbills_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            bill          postgres    false    231    7            �            1259    310348    TransactionDetail    TABLE     R  CREATE TABLE public."TransactionDetail" (
    "TransactionDetailId" integer NOT NULL,
    "TransactionId" integer NOT NULL,
    "LedgerId" bigint,
    "ProductId" bigint,
    "TransactionId1" bigint NOT NULL,
    "Credit" numeric,
    "Date" date DEFAULT '-infinity'::date NOT NULL,
    "Debit" numeric,
    "InvoiceNumber" text DEFAULT ''::text NOT NULL,
    "Narration" text,
    "Piece" integer DEFAULT 0,
    "TransactionMethod" integer DEFAULT 0 NOT NULL,
    "TransactionType" integer DEFAULT 0 NOT NULL,
    "UserId" bigint DEFAULT 0 NOT NULL,
    "TranId" integer DEFAULT 0 NOT NULL
);
 '   DROP TABLE public."TransactionDetail";
       public         heap    postgres    false    4            �            1259    310415 )   TransactionDetail_TransactionDetailId_seq    SEQUENCE     	  ALTER TABLE public."TransactionDetail" ALTER COLUMN "TransactionDetailId" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."TransactionDetail_TransactionDetailId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    226    4            �            1259    310237    __EFMigrationsHistory    TABLE     �   CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);
 +   DROP TABLE public."__EFMigrationsHistory";
       public         heap    postgres    false    4            �            1259    310244 
   categories    TABLE       CREATE TABLE stock.categories (
    id bigint NOT NULL,
    category_name text NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id bigint DEFAULT 0 NOT NULL
);
    DROP TABLE stock.categories;
       stock         heap    postgres    false    6            �            1259    310243    categories_id_seq    SEQUENCE     �   ALTER TABLE stock.categories ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME stock.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            stock          postgres    false    6    213            �            1259    310252 	   companies    TABLE       CREATE TABLE stock.companies (
    id bigint NOT NULL,
    company_name text NOT NULL,
    company_size text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id bigint DEFAULT 0 NOT NULL
);
    DROP TABLE stock.companies;
       stock         heap    postgres    false    6            �            1259    310251    companies_id_seq    SEQUENCE     �   ALTER TABLE stock.companies ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME stock.companies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            stock          postgres    false    6    215            �            1259    310260    ledgers    TABLE     �  CREATE TABLE stock.ledgers (
    id bigint NOT NULL,
    ledger_code text NOT NULL,
    ledger_name text NOT NULL,
    contact text NOT NULL,
    address text NOT NULL,
    parent_id bigint,
    master_account text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    is_tran_gl boolean NOT NULL,
    user_id bigint DEFAULT 0 NOT NULL,
    level integer DEFAULT 0 NOT NULL
);
    DROP TABLE stock.ledgers;
       stock         heap    postgres    false    6            �            1259    310259    ledgers_id_seq    SEQUENCE     �   ALTER TABLE stock.ledgers ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME stock.ledgers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            stock          postgres    false    6    217            �            1259    322873    offices    TABLE     �  CREATE TABLE stock.offices (
    id bigint NOT NULL,
    branch_name text NOT NULL,
    branch_address text NOT NULL,
    phone_number text NOT NULL,
    is_head_office boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    pan_vat_number text DEFAULT ''::text NOT NULL,
    registration_number text DEFAULT ''::text NOT NULL
);
    DROP TABLE stock.offices;
       stock         heap    postgres    false    6            �            1259    322872    offices_id_seq    SEQUENCE     �   ALTER TABLE stock.offices ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME stock.offices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            stock          postgres    false    6    229            �            1259    310268    products    TABLE     #  CREATE TABLE stock.products (
    id bigint NOT NULL,
    product_name text NOT NULL,
    product_description text,
    product_size text NOT NULL,
    marked_price numeric NOT NULL,
    cost_price numeric NOT NULL,
    whole_sale_price numeric NOT NULL,
    retail_price numeric NOT NULL,
    image_url text NOT NULL,
    category_id bigint NOT NULL,
    company_id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id bigint DEFAULT 0 NOT NULL,
    ledger_id bigint
);
    DROP TABLE stock.products;
       stock         heap    postgres    false    6            �            1259    310267    products_id_seq    SEQUENCE     �   ALTER TABLE stock.products ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME stock.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            stock          postgres    false    219    6            �            1259    310286    transactions    TABLE     T  CREATE TABLE stock.transactions (
    id bigint NOT NULL,
    transaction_id integer NOT NULL,
    date date NOT NULL,
    invoice_number text NOT NULL,
    ledger_id bigint,
    product_id bigint,
    piece integer,
    transaction_type text NOT NULL,
    transaction_method text NOT NULL,
    debit numeric,
    credit numeric,
    narration text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id bigint DEFAULT 0 NOT NULL,
    eng_date date DEFAULT '-infinity'::date NOT NULL,
    is_opening_bal boolean DEFAULT false NOT NULL
);
    DROP TABLE stock.transactions;
       stock         heap    postgres    false    6            �            1259    310285    transactions_id_seq    SEQUENCE     �   ALTER TABLE stock.transactions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME stock.transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            stock          postgres    false    221    6            �            1259    310308    users    TABLE     �  CREATE TABLE stock.users (
    id bigint NOT NULL,
    first_name text NOT NULL,
    middle_name text,
    last_name text NOT NULL,
    address text NOT NULL,
    phone character varying(10) NOT NULL,
    user_type text NOT NULL,
    email text NOT NULL,
    user_name text,
    password_hash text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    gender text DEFAULT ''::text NOT NULL,
    user_id bigint DEFAULT 0 NOT NULL
);
    DROP TABLE stock.users;
       stock         heap    postgres    false    6            �            1259    310307    users_id_seq    SEQUENCE     �   ALTER TABLE stock.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME stock.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            stock          postgres    false    6    223            �            1259    310331 
   userslogin    TABLE     �   CREATE TABLE stock.userslogin (
    "Id" bigint NOT NULL,
    "UserId" bigint NOT NULL,
    "LogInDT" timestamp with time zone NOT NULL
);
    DROP TABLE stock.userslogin;
       stock         heap    postgres    false    6            �            1259    310330    userslogin_Id_seq    SEQUENCE     �   ALTER TABLE stock.userslogin ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME stock."userslogin_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            stock          postgres    false    6    225            k          0    322894    vatbills 
   TABLE DATA             COPY bill.vatbills (id, bill_number, date, eng_date, customer_name, customer_address, customer_vat_pan, customer_contact, product_name, size, quantity, rate, amount, discount, taxable_amount, vat_rate, net_amount, created_at, updated_at, product_id) FROM stdin;
    bill          postgres    false    231   ,m       f          0    310348    TransactionDetail 
   TABLE DATA           �   COPY public."TransactionDetail" ("TransactionDetailId", "TransactionId", "LedgerId", "ProductId", "TransactionId1", "Credit", "Date", "Debit", "InvoiceNumber", "Narration", "Piece", "TransactionMethod", "TransactionType", "UserId", "TranId") FROM stdin;
    public          postgres    false    226   Im       W          0    310237    __EFMigrationsHistory 
   TABLE DATA           R   COPY public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") FROM stdin;
    public          postgres    false    211   �m       Y          0    310244 
   categories 
   TABLE DATA           d   COPY stock.categories (id, category_name, description, created_at, updated_at, user_id) FROM stdin;
    stock          postgres    false    213   �o       [          0    310252 	   companies 
   TABLE DATA           c   COPY stock.companies (id, company_name, company_size, created_at, updated_at, user_id) FROM stdin;
    stock          postgres    false    215   �p       ]          0    310260    ledgers 
   TABLE DATA           �   COPY stock.ledgers (id, ledger_code, ledger_name, contact, address, parent_id, master_account, created_at, updated_at, is_tran_gl, user_id, level) FROM stdin;
    stock          postgres    false    217   r       i          0    322873    offices 
   TABLE DATA           �   COPY stock.offices (id, branch_name, branch_address, phone_number, is_head_office, created_at, updated_at, pan_vat_number, registration_number) FROM stdin;
    stock          postgres    false    229   v       _          0    310268    products 
   TABLE DATA           �   COPY stock.products (id, product_name, product_description, product_size, marked_price, cost_price, whole_sale_price, retail_price, image_url, category_id, company_id, created_at, updated_at, user_id, ledger_id) FROM stdin;
    stock          postgres    false    219   �v       a          0    310286    transactions 
   TABLE DATA           �   COPY stock.transactions (id, transaction_id, date, invoice_number, ledger_id, product_id, piece, transaction_type, transaction_method, debit, credit, narration, created_at, updated_at, user_id, eng_date, is_opening_bal) FROM stdin;
    stock          postgres    false    221   .|       c          0    310308    users 
   TABLE DATA           �   COPY stock.users (id, first_name, middle_name, last_name, address, phone, user_type, email, user_name, password_hash, created_at, updated_at, gender, user_id) FROM stdin;
    stock          postgres    false    223   ��       e          0    310331 
   userslogin 
   TABLE DATA           >   COPY stock.userslogin ("Id", "UserId", "LogInDT") FROM stdin;
    stock          postgres    false    225   1�       s           0    0    vatbills_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('bill.vatbills_id_seq', 1, false);
          bill          postgres    false    230            t           0    0 )   TransactionDetail_TransactionDetailId_seq    SEQUENCE SET     Z   SELECT pg_catalog.setval('public."TransactionDetail_TransactionDetailId_seq"', 86, true);
          public          postgres    false    227            u           0    0    categories_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('stock.categories_id_seq', 5, true);
          stock          postgres    false    212            v           0    0    companies_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('stock.companies_id_seq', 8, true);
          stock          postgres    false    214            w           0    0    ledgers_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('stock.ledgers_id_seq', 29, true);
          stock          postgres    false    216            x           0    0    offices_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('stock.offices_id_seq', 1, true);
          stock          postgres    false    228            y           0    0    products_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('stock.products_id_seq', 31, true);
          stock          postgres    false    218            z           0    0    transactions_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('stock.transactions_id_seq', 252, true);
          stock          postgres    false    220            {           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('stock.users_id_seq', 12, true);
          stock          postgres    false    222            |           0    0    userslogin_Id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('stock."userslogin_Id_seq"', 95, true);
          stock          postgres    false    224            �           2606    322900    vatbills PK_vatbills 
   CONSTRAINT     R   ALTER TABLE ONLY bill.vatbills
    ADD CONSTRAINT "PK_vatbills" PRIMARY KEY (id);
 >   ALTER TABLE ONLY bill.vatbills DROP CONSTRAINT "PK_vatbills";
       bill            postgres    false    231            �           2606    310417 &   TransactionDetail PK_TransactionDetail 
   CONSTRAINT     {   ALTER TABLE ONLY public."TransactionDetail"
    ADD CONSTRAINT "PK_TransactionDetail" PRIMARY KEY ("TransactionDetailId");
 T   ALTER TABLE ONLY public."TransactionDetail" DROP CONSTRAINT "PK_TransactionDetail";
       public            postgres    false    226            �           2606    310241 .   __EFMigrationsHistory PK___EFMigrationsHistory 
   CONSTRAINT     {   ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");
 \   ALTER TABLE ONLY public."__EFMigrationsHistory" DROP CONSTRAINT "PK___EFMigrationsHistory";
       public            postgres    false    211            �           2606    310250    categories PK_categories 
   CONSTRAINT     W   ALTER TABLE ONLY stock.categories
    ADD CONSTRAINT "PK_categories" PRIMARY KEY (id);
 C   ALTER TABLE ONLY stock.categories DROP CONSTRAINT "PK_categories";
       stock            postgres    false    213            �           2606    310258    companies PK_companies 
   CONSTRAINT     U   ALTER TABLE ONLY stock.companies
    ADD CONSTRAINT "PK_companies" PRIMARY KEY (id);
 A   ALTER TABLE ONLY stock.companies DROP CONSTRAINT "PK_companies";
       stock            postgres    false    215            �           2606    310266    ledgers PK_ledgers 
   CONSTRAINT     Q   ALTER TABLE ONLY stock.ledgers
    ADD CONSTRAINT "PK_ledgers" PRIMARY KEY (id);
 =   ALTER TABLE ONLY stock.ledgers DROP CONSTRAINT "PK_ledgers";
       stock            postgres    false    217            �           2606    322879    offices PK_offices 
   CONSTRAINT     Q   ALTER TABLE ONLY stock.offices
    ADD CONSTRAINT "PK_offices" PRIMARY KEY (id);
 =   ALTER TABLE ONLY stock.offices DROP CONSTRAINT "PK_offices";
       stock            postgres    false    229            �           2606    310274    products PK_products 
   CONSTRAINT     S   ALTER TABLE ONLY stock.products
    ADD CONSTRAINT "PK_products" PRIMARY KEY (id);
 ?   ALTER TABLE ONLY stock.products DROP CONSTRAINT "PK_products";
       stock            postgres    false    219            �           2606    310292    transactions PK_transactions 
   CONSTRAINT     [   ALTER TABLE ONLY stock.transactions
    ADD CONSTRAINT "PK_transactions" PRIMARY KEY (id);
 G   ALTER TABLE ONLY stock.transactions DROP CONSTRAINT "PK_transactions";
       stock            postgres    false    221            �           2606    310314    users PK_users 
   CONSTRAINT     M   ALTER TABLE ONLY stock.users
    ADD CONSTRAINT "PK_users" PRIMARY KEY (id);
 9   ALTER TABLE ONLY stock.users DROP CONSTRAINT "PK_users";
       stock            postgres    false    223            �           2606    310335    userslogin PK_userslogin 
   CONSTRAINT     Y   ALTER TABLE ONLY stock.userslogin
    ADD CONSTRAINT "PK_userslogin" PRIMARY KEY ("Id");
 C   ALTER TABLE ONLY stock.userslogin DROP CONSTRAINT "PK_userslogin";
       stock            postgres    false    225            �           1259    322902    IX_vatbills_product_id    INDEX     Q   CREATE INDEX "IX_vatbills_product_id" ON bill.vatbills USING btree (product_id);
 *   DROP INDEX bill."IX_vatbills_product_id";
       bill            postgres    false    231            �           1259    310403    IX_TransactionDetail_LedgerId    INDEX     e   CREATE INDEX "IX_TransactionDetail_LedgerId" ON public."TransactionDetail" USING btree ("LedgerId");
 3   DROP INDEX public."IX_TransactionDetail_LedgerId";
       public            postgres    false    226            �           1259    310404    IX_TransactionDetail_ProductId    INDEX     g   CREATE INDEX "IX_TransactionDetail_ProductId" ON public."TransactionDetail" USING btree ("ProductId");
 4   DROP INDEX public."IX_TransactionDetail_ProductId";
       public            postgres    false    226            �           1259    310358 #   IX_TransactionDetail_TransactionId1    INDEX     q   CREATE INDEX "IX_TransactionDetail_TransactionId1" ON public."TransactionDetail" USING btree ("TransactionId1");
 9   DROP INDEX public."IX_TransactionDetail_TransactionId1";
       public            postgres    false    226            �           1259    310341    IX_companies_user_id    INDEX     N   CREATE INDEX "IX_companies_user_id" ON stock.companies USING btree (user_id);
 )   DROP INDEX stock."IX_companies_user_id";
       stock            postgres    false    215            �           1259    310303    IX_products_category_id    INDEX     T   CREATE INDEX "IX_products_category_id" ON stock.products USING btree (category_id);
 ,   DROP INDEX stock."IX_products_category_id";
       stock            postgres    false    219            �           1259    310304    IX_products_company_id    INDEX     R   CREATE INDEX "IX_products_company_id" ON stock.products USING btree (company_id);
 +   DROP INDEX stock."IX_products_company_id";
       stock            postgres    false    219            �           1259    310305    IX_transactions_ledger_id    INDEX     X   CREATE INDEX "IX_transactions_ledger_id" ON stock.transactions USING btree (ledger_id);
 .   DROP INDEX stock."IX_transactions_ledger_id";
       stock            postgres    false    221            �           1259    310306    IX_transactions_product_id    INDEX     Z   CREATE INDEX "IX_transactions_product_id" ON stock.transactions USING btree (product_id);
 /   DROP INDEX stock."IX_transactions_product_id";
       stock            postgres    false    221            �           2606    322903 (   vatbills FK_vatbills_products_product_id    FK CONSTRAINT     �   ALTER TABLE ONLY bill.vatbills
    ADD CONSTRAINT "FK_vatbills_products_product_id" FOREIGN KEY (product_id) REFERENCES stock.products(id) ON DELETE CASCADE;
 R   ALTER TABLE ONLY bill.vatbills DROP CONSTRAINT "FK_vatbills_products_product_id";
       bill          postgres    false    3247    231    219            �           2606    310418 7   TransactionDetail FK_TransactionDetail_ledgers_LedgerId    FK CONSTRAINT     �   ALTER TABLE ONLY public."TransactionDetail"
    ADD CONSTRAINT "FK_TransactionDetail_ledgers_LedgerId" FOREIGN KEY ("LedgerId") REFERENCES stock.ledgers(id);
 e   ALTER TABLE ONLY public."TransactionDetail" DROP CONSTRAINT "FK_TransactionDetail_ledgers_LedgerId";
       public          postgres    false    226    217    3243            �           2606    310423 9   TransactionDetail FK_TransactionDetail_products_ProductId    FK CONSTRAINT     �   ALTER TABLE ONLY public."TransactionDetail"
    ADD CONSTRAINT "FK_TransactionDetail_products_ProductId" FOREIGN KEY ("ProductId") REFERENCES stock.products(id);
 g   ALTER TABLE ONLY public."TransactionDetail" DROP CONSTRAINT "FK_TransactionDetail_products_ProductId";
       public          postgres    false    226    219    3247            �           2606    310353 B   TransactionDetail FK_TransactionDetail_transactions_TransactionId1    FK CONSTRAINT     �   ALTER TABLE ONLY public."TransactionDetail"
    ADD CONSTRAINT "FK_TransactionDetail_transactions_TransactionId1" FOREIGN KEY ("TransactionId1") REFERENCES stock.transactions(id) ON DELETE CASCADE;
 p   ALTER TABLE ONLY public."TransactionDetail" DROP CONSTRAINT "FK_TransactionDetail_transactions_TransactionId1";
       public          postgres    false    226    221    3251            �           2606    310342 $   companies FK_companies_users_user_id    FK CONSTRAINT     �   ALTER TABLE ONLY stock.companies
    ADD CONSTRAINT "FK_companies_users_user_id" FOREIGN KEY (user_id) REFERENCES stock.users(id) ON DELETE CASCADE;
 O   ALTER TABLE ONLY stock.companies DROP CONSTRAINT "FK_companies_users_user_id";
       stock          postgres    false    3253    215    223            �           2606    310275 +   products FK_products_categories_category_id    FK CONSTRAINT     �   ALTER TABLE ONLY stock.products
    ADD CONSTRAINT "FK_products_categories_category_id" FOREIGN KEY (category_id) REFERENCES stock.categories(id) ON DELETE RESTRICT;
 V   ALTER TABLE ONLY stock.products DROP CONSTRAINT "FK_products_categories_category_id";
       stock          postgres    false    213    3238    219            �           2606    310280 )   products FK_products_companies_company_id    FK CONSTRAINT     �   ALTER TABLE ONLY stock.products
    ADD CONSTRAINT "FK_products_companies_company_id" FOREIGN KEY (company_id) REFERENCES stock.companies(id) ON DELETE RESTRICT;
 T   ALTER TABLE ONLY stock.products DROP CONSTRAINT "FK_products_companies_company_id";
       stock          postgres    false    215    3241    219            �           2606    322887 &   products FK_products_ledgers_ledger_id    FK CONSTRAINT     �   ALTER TABLE ONLY stock.products
    ADD CONSTRAINT "FK_products_ledgers_ledger_id" FOREIGN KEY (ledger_id) REFERENCES stock.ledgers(id) ON UPDATE CASCADE ON DELETE CASCADE;
 Q   ALTER TABLE ONLY stock.products DROP CONSTRAINT "FK_products_ledgers_ledger_id";
       stock          postgres    false    3243    217    219            �           2606    310428 .   transactions FK_transactions_ledgers_ledger_id    FK CONSTRAINT     �   ALTER TABLE ONLY stock.transactions
    ADD CONSTRAINT "FK_transactions_ledgers_ledger_id" FOREIGN KEY (ledger_id) REFERENCES stock.ledgers(id);
 Y   ALTER TABLE ONLY stock.transactions DROP CONSTRAINT "FK_transactions_ledgers_ledger_id";
       stock          postgres    false    221    217    3243            �           2606    310433 0   transactions FK_transactions_products_product_id    FK CONSTRAINT     �   ALTER TABLE ONLY stock.transactions
    ADD CONSTRAINT "FK_transactions_products_product_id" FOREIGN KEY (product_id) REFERENCES stock.products(id);
 [   ALTER TABLE ONLY stock.transactions DROP CONSTRAINT "FK_transactions_products_product_id";
       stock          postgres    false    221    219    3247            k      x������ � �      f   P   x�M�1�0g�/ENՠ���;�� �_$ {:����zG�D��Ћ3\�9�=�4P|M'�2�����g�+�EDlb'      W   �  x�uT�n�0}n�B_P7_�m-
���}* �����@V��G+���X�!uH��BTrV��tU�aM�e����B=�&x�d�� Aշ�O6&k�q��|�$2��|;�c�_��-����F��!�׮#M莽'}0n���>�� uk�ÌY����zB!ęgT����N.��_;;�h�@u�u�d��������vִx�bR��'��s�Qp�]�ֵ������m�ڟ�q�J�Km�.�VS�Bo�1��d"|7�(P*A=�a�1�$J��'��
��ͱ
mR�R��&��%���4io�ဥ�������8&̓m�ٸ�QB��j�]�÷�u���f74���1�_D9F�e�0͏JV����5��'��KJX�(�Ge��C�ؤ�y���H.E��u"�}���h��i�=��D'L�O�H���&?o�y�~�g�n���Fb��5m��Ɵ�X��8X�K~������M���^�V ��4      Y   	  x�u�MO�0E��������~�.�ɸp��n� T!`k
f���G�����^ ���+r7�_X[�5��=A�� (�c�z%<  �3B{�� �A�\���Mڳj�S�V�U���а��S���Y�x���t /��;+����4PZy�K��vc>����>"7�����x0���;
�u� �^�W��C�T���q����^ލ�oXre��r8����+٥�=о��@c����
14����
�gƙ�A�GN)��=zY      [   G  x���OO!���)��%3,�֤�iԋ�̒���v[�o/1�ۚ�^�����g�cx�6~�� f�N�iW��X�ݒi�� (4	0ޔ^+I���2�̅���L�,�6�?Ǒݥeh�!��m�v�i���iZ9���&	*W��_'��[�ɺ���@z 	�hm�↍C�l�b;�v���1�٫䣀N�=/�x����;Iq+fmڇ.�iZ�.�C��	$���^�j6Y���O���D2� �x�^Y���{�]:�*OU֣�$���P��l]��8G}�/®��	P�t�@����Ӳ̭�g��[@�Urο Z���      ]   �  x���Mo�6���_�S/��p���c��Q�1��@.�F�*^������C�"KZ�싍����4�Zk��c]���ze�yv��K~8�Gp-�ZY�dfl&Qx���_���L|f�p�7]�#C&W ��{��y�{$��t�V�ΓB&�0���'�"��n��v7��ef��h�2�	g4z5�ɖ��&�c���8I�H�tX�)���0©���-,��e��<�4dׇm�|�Lk:K+4K0��s`�0�jcW�/��5��o2� �8)�"�	��WP'�.��>ֻ���c^��ź?~tdJe�� �M8� p�	D�)�5e���K��h)�Y�N�c��
�,`�s�1�z���x�HM<�x޺t���fʈ`�٩N&ƌ[��u��UN*y)�oY�ʎž��!.�Ө;`J���q���/2$\H8�ӫoMQ��{�P�P%�Q�O�y�}}	舗\w_�y�.�����?U�K^Y��84��)��a�0;ME���+�i��5�0He>`��^�@h��Ϸ��_���#dH��Z�: ��G��a��]�;e�L��x8w�ɞ�A��~�Bax���k��v�lHA/����[����ܘ�-�F�a@�A5����6�/r4_ dR'����0R��
�$�k��}�͋�m��U�����S��:lɎ���秲����b��9�!�֞�*��9'�G�j&�a@?�O5'���O5�p �I��Ò#����ӵ�KN35��2w�b�-�CM$���p��~~���*!�'NKI�h��e�&�U�c���� +�&v�.��~ ��O���tϴ{�+�@+��
���t>�OK�cZ��qpA)XJ��ֹQ��tǺ��o�;.�(MO�O8o��3�A Z3����ֹ9���pj����I�a~��LZ��� �撶vyw�=��I���� �E�E��Xa�����?T�]Smw�40@��f��<.<�|�v��Ǐ��b�Z�w�      i      x���K�  �5������
'0ѸЭ�IL
ڏ6p��o�P�<������vu��[\yym�S�x�U�N����Gq��т��
�4�Ơ���D�x����E��/�р3��佗R~�&+      _   �  x�u�[o�F���_��b��ٙ��IP7h�^R��/{��Z�Yn��!EY��@AKc���3�����]�k|lC���͇�f��~���}����~��zh~x�n�-4ƃ��h��)'�����
%������_��e�y!�QZ+�֝��*8k�]��h�޹�{�g�O��zh�H���xbE�B�it �/V �KU�X��VP��I�ώmu�/�u��DA�W� ���:`����}N��n�\��������fݐ�2�p$��>(9�}�U��m߳I��� ��v�u�Vl8x}Ez]�g��H��wۗ�~�ħ����}W�����Om/f��6��q]ۼ�Ͽ6���Ao�!zY�"8&*�z��7)+�5ys�H�mЫ9P��j�DRp+�����������f��ǗC=�Ï�PN�́<X�'_���m�*Ba�A�LY٘�<���dd����l���k�e��.X͌�8~e"��^���&]�.`�Tu�Wd#��uV����@���7YY�B �F֫�_}|B�y\�Y˅����ؘ�
,N���\�S}b+O]{ALs/���Z�ۉŃg���y�[��T{����x�П�[~Y�	+S��Z�+�J}eAOz-F4fbu�(nx�ƣ�x��� �uJ�I�p�[�1�n�����j�?=�]��84C�{�D59c�T�v�V�<骒|�m�܏�S�鬴=�H�@l \�o��=�O�@_��U��iH�ip��C�N�!U�$�y���I�Z�!�a�s2��w0����S���:/]�[��n����k?{�ԙ�Jv�Ǝ��)�����"�^RDu�|��+y��W��:4����%k�%D��>��S�����Fĕ)H�����	I|��{�$�����Nەvd����X�1E&k�v����)2���L�Ȱ����*���a���/3�ZЀ��s$7��YK�6�@/��&��	�����fw	?��Xx8�@�@��Ű(��^.��Q�G�ӷhÐ	6 ޴��.���%�/���~_�To\%�����!q�����D�y�#Nb�(�8��$Ԙ��	px-t�+o�c��8+��i~zxy<l�?^�n��]�O��"g���9�d����ykˁ��t��0��*DSU}�	-e}�0y�b䑏:����k���Y�@8k���O��}����L^�<���q���  �� b+�-�es �Ct<)<��h:�:�*�7��5���"dO����3�QI�<��!O6Ko\���de��9+�Q�9����Y]�~�	��Ћ�f�,�_���������4���$���G���U��P��d�������'��Bh;�p�m���h?��{uww�?:W      a   �  x��\Ko�F>ӿ����~?x[g��b���vra����<c�$��[��ͮ*��2�3�<����U�R�q�Q"�+	?��B���Ml~�O��e��y�l~>5V�F�Gw���};����������2���o�e�\	y�l+u�B�}���M��X`O �@bs�J)I��?,E�I�䏎�E����%���Ԟ�?����>�;}z���Gx���7�Jࢀ���t�yMU��ɒ��T#bz�]�=&�T����������x�k7�������t���b�[� m/|�}0k�n_5Ζ��x���/�򓖾�㷤����򝮕�סW�S�
���H�敦yqZ92{&/B^5�м�U�v#/��F
)�޲QH!�Q%?<}����zw������ܝ�LBY UI �J�L�5:�de���l)�`'��w}�U�v�AiCr�2���JB.Q5vq3 P�%� �B0��g2�/��됱�����3BK�dX�) �ɘƺ�\����V>����a�YoDb2� S>��X�������P�� %K�q@��F&�/ɀ{w��.�:��i;-Tt��0�ke1����h��La�+`aMab�7�t�~���U��d8@��fq��Rp#���e��<8(L�����YY����Q�3�+d� Q�튂v��+�ۣy�ϒ�p�V�< ��h]�8�,��TC
�tCfR߻��,\;r��s��Y%�Xt+g�dA�|B[Eʃ  y�FJ��ȱ�i��>���zN��"���d�XMǓD����N_u���q��O�*��n�������vuA�����������h�:�=��S��v�qw�e��'mj��OIn�<8�:��� ����|�y��Z�Q������&N���'&S�5N���XL)kiz��N���������vN�g��p�����]�����Psr�՗k3��KM���m�d��2P���4�D9�D�����{�1��1��'����R�f-S�����jӜ���ے��줗N0� $AH{U��S�+�*��� ����'��O��D��D�P�f����W!�L�RѲ��l|����O��w��ԨS�*RY�{!mr>�2�������fƚ�����E��.�1f�o,���V�Qjږs�,���!��l�O���U�<�MH�g��.Z+r�k��D|�F)�s�� 7_�J�~D���'��[(��D��N(Rd�O-��T�\ �e
f�Lc�"G5���JQX0h��T��V�����e��j���T #�C��3�o�*�Ր�_���t�Ȧ�`]�k��9Qx�x�Ƙ��ͼC̦jr��� E��|u���>�&Z��&*r>'-�@~�ϩ| �qnb�mHa!��[__W n�d2��ʅ�:S����M���GHy8@�`��I���ۊQo����+���c�{@�]�xC\�+Y�P�N_�"#}q�餲�ۨ�$ؐ �߯d�7�~��k
���g2b�N��;�Π�
@�\cBI�{O7V,�X�
)�Zf�� ���ol\�7[�v��W�ZS�@��)#��)����ƥ�.k]F=��!4*�W ��K6.�i����^ܹ�Z���2��K���'���͢��8 *j=�D�:r���� k2�*c�%릾l֬�9�+�f�@a�(Q2�!.T���R��нMUS� �5@pҀ���Pj�@
�*��á��Dt��� �LZ$0%�:�V��{�CO@]��I��ZS8yɍ7�ˤ������)۰�ש
�
 c�=�,��U�}l�ih>U?'��M�ac�R�%kH3��\d	����;��C�F�;P�����ٝ)���e^} 5c��W|��%��%��h\�s �\n�/�`�}|2P��� ��4|I#N4Ԫ��XC�re;0$��=@L�
V�-��a��y�fL��p4��&�\�*��x1	�2v����|� �餦��@��Bȳ�Kf�����zg$U�25�T�qoւr���P1h�bpKF�KA�b?@iHfG�q/S<��S��sP�2yG"(,�y�:�i<�����2�q-�g6v�/P5v��=IJ!I�:l�tdv��*��Թ'Vf0�U��G��0KIP'rQ6v顂i��0ϳ�����qw��M�[/۸*pW�zj�O
���Yq�f-�J1�I�u��p�۷�� .�tZ2�	�6%hv �h�_pQ�0-xä3�j%���C��s���&ft� $�m�,NI�T��qJ9t�ԶE�E*j뜤��4�Ji�j��L��u�q.7���p����D��g��~�:;���)� �3I���"E�x��Be��;��НH��A��1owC�X ��g�9Y��S���9�R�@sG�9���d�AQ��sxIu���p��N�8 ��j���%��ۛ�:��'��%Z�F�#Ѳ��u�%�M�vX ��>�YU:u���N9#/@|�F+}���Fݨ3}t�v�E#]jb�2�4/ZIM�� "�!j��3�e���s�Pjh��p��o�'9�Ned�_���:�)�^G�\�p@�F�[�p8W�rb<S��ڑ$ -gN5h���	W�[K�^<�B�K� -��Ɖ��b.��& �R��[�ݱ��t�e����.JX z��%��Z�P�Đ�)�u|U��R]�r9B����I��n�,]O��6��ի��6 �k�@؜pfu}�͵�i���n_3q�����uv��~��uu3��.ee^�� $MKo"�0q['�.��HJ��E������������ɼ�5g-�ZsMޕ|{��@����C�zd���z���vr�V�Ky��yg���� ނ��Nm�7���\�RG{ QW�_x5鰮C���zV��~׾9��4���&m�(��-��k)$�C�1$���#����<*	@�+A��%�_KO��o��x|ꭾ�UF(�V����g��y�B�2�%�ϻ�|�LŜZƔZ/��2�7#b�ב|y�&�/"�>@d}�"KZ�uE8�������}ut��.���v, q4����>Ȫ�]��R��E�e��/�������>[/���۲��k������5x���)N�Rv�
�QL� ��]<�Bb�o��43żMs��<f��� 1��W�i��p�e��u���W|����{�֠y��ӥ�!�>S��l�:/���_D�'���C�y�d��Z6���M��M�NtiD�}�@Ͱ5@ƈs�%KR�h��p��F�� B"�v�D�[Pz�i��|/D���E�)&+ �QOL<̈́��j�u���'� D$0"���
f���$ � ��Kc�&���wͿ���2�>i��"2��m�U�k��X�#�� N�ǧ���x�E?��@��;�"EkS�;*a�v�����j;c�����"Nb���?��(^�.V}�@���իW�i�N�      c   A  x�}�Ks�@�����"��4��U��	Q1J�f�(Dy����Iƚ]��ܪ��{��f����,g�\�@'��dy��Щ@����4� �e.���ng�#8Ib�Ȫ�k,��[���g3��rHl[L�.���5�+k��}�;��6/�7���4�br���W�01���TfPv�+�HC��H���+#�5����OACrZ�U1�pW��o�Uy�&�e��+�h��[�=���7�L�癊=`�XǛ�"�����!�P�`%��q��ꋂ^��W�(�H��5?�O��y�i�aF�i���ñ��o>Zr{]�p}i'<����|XLI�T������lO�s+���$���TSU���"tC���v���:E뜭��I��*M�7U[$�ފw�>�y���n�3�5i�	��`c��F՞�o����e��2��*y�JoT\�V��� :Ĝ�s<���`�*ZC�t��98�g'�r+��x�z�2o�vt�w�i)t�q�>�[i�dS5H�'ϊ�����i3]Gc�wwf6
C2�p��0 q�ŗ �4��j�O��6      e   p  x�}�K�,9E�U��y�Y�����:\i2���R�q�|��'��?�?���Kl ���3�b�Ư8!������'��pA|���Bl$�!9^��� '���Kz�]DCEm���%̈́2��h����]���`�-A���������`�)�ȴW�Pb�]3.I�R*�j�E>B%�#ҝ�z���C5ۥ���4�^4/�aH[,���K�>6�A�V��R�������IyQ��m����T���`�V<��%$��������Ӷ�
�"<P6�J �\�:"T�+jn���_�'8�
�<��@�g�mJT0�R�]G�'���3�O�����O����/
�7 �mO��I�:b�㖞N�s��jk ��N��Q��Tw�t*O�A��sJ�;�N�s>D�FHV���[y�3�ZQ/�A��M�'���7��yٓ�r��)v^~P5&/�aj6[�8��Y���#x>����>�p'�p�x�ޖ���M�A�U�e+r�E�&8Y�]O�l�f�!��.�] ���qY[c ��;���\������ʩ9TQy���"R���9}��㠰�%��d��̃Z(�b����A�>�U5fV������9�ss��.=��y9"�}���Bp}"�vĻ���2�pf��x�q{Vc���]E�+�QO��(��%���'����Y7�������d_�F
�;C��YO���`�ҦW��KD=��V�S*A�\Y; �)-�S{�q��T����)��C�:���5QM읗�)+o�OE�䀐=,�j�5�zM�������ᔮ�ƃ�'����c�5�r����b���D0<�4Չ�y�Q��=Rul�TB!�)~PyxeDˎ��drP����+'�u�w�Q��;���h����
�rAZB�(�w�iy0�A�$,s������z+�,�q_�����s�3gg�wjY�"������2z�a�rzP�&��1�͜�PT3:�����|I�����A�j����x�;e�f�RK�KOA�U�K�����?��u�E������w��u�5�;6���]����rs�k��v�A_���刚�y�g��D�W�I80�d��^g&�k5,sQ��t��������K�l     