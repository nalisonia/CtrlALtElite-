--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Homebrew)
-- Dumped by pg_dump version 16.4 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (sid, sess, expire) FROM stdin;
qfTp4TleEVkG3DXp9RBvRdTagfPnmG1C	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 15:59:09
OdeTN4UFbXxYkNOgNhv-Ud74wu3dYsyN	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 15:59:09
d9UpR-fzUeuRh2EuKwhi6dP196WsaZKU	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 15:59:44
FcAx6UuwvBI0oB6Ir7ZfkCXPzKeExdcX	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 15:59:44
ybPQ_SqPIpJ0Us-aWAYSN4jWaiVh7txE	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 15:59:58
q1kKT0LTQjWCTMAK5ETnvzv00InwsevY	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"userId":9}	2024-10-19 15:59:58
WSQ9ITOENRb-aiwNSJ9skvDBIBSdv6_x	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:00:51
W9sfdREQhGjPqlLkxfEyAauF2snFmKzv	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"userId":9}	2024-10-19 16:00:51
dlQRhZkuW75RLX9E-kjDTzBDhMO3Tz_0	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:11:29
NKFOuaWtyf55mjou7CwsfgVXP6vuP0HK	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:11:29
nV8O8YG1feR0qWLaEHcYZ_luCT983moe	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:11:37
oC1e5Zd6JYatXMsmWcoz7HwvQUQL9Qtj	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"userId":9}	2024-10-19 16:11:37
lVIPQHje59cc9jAz3fw55lIwQcUF3OVg	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:15:27
iW70KvN0GSD859Nb5gX4JzltQ8y6tn0a	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:15:27
HqnR_ArtoAZ0N9HVJGUvbh01lZGZRMLj	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:15:27
B26AGXpfCMiiIv8IZRw5NzGcGPo28snC	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:15:27
RL1DW_Oych-lqYT_3wd9mll1ArpDw9Np	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:25:32
pUe_077rIkX0tbw0oeNdfoOsWZjkdpJi	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:25:32
B5z1TuXKyrycOJQ2O8y0L12TYSkG8eRf	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:26:46
c1rOQkyXJNhVSqmlW4TDgS0IMXpr78bL	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"userId":10}	2024-10-19 16:26:46
qaMiNN5mxMlH9XbyyUtLhQ0EWTyilUC1	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:27:29
afN7JvE6b4MMfDird10fHkePBMchN4cr	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:27:29
gU9nofDstm37ss3qrx3tH_IEcWLqYcMJ	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:27:29
eMZ7AekKumgnxxuoMJUVMQRYSbtb9EK5	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:27:29
w3S93drhJVoCglOCGduib066hebI6e4l	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:27:52
68H067tB0nS1YXZJwzSjSaNoJFbHNX36	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:27:52
hxevJqdWKiNSYwEAC2MFWTd3eJrOtWRZ	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:27:52
gpP8oZyvbPM5tVWTCuHYol7rsLZq1eqt	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:27:52
zWYVXWgP8oXJWfr35Twi4NLAWEuI593b	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:28:15
WfNiVpBre-pbJciD3iDuw7SIR4dOUtOY	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:28:15
20E9T3f5d-v6NVKxxQYmGbJaDw7rd3IP	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:28:15
pztB0zwgck_WvPHtLmtJXRZF_XEake5Y	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:28:15
P-uW0OnxrlubiyFLTMiTvhrdcd7I87Yj	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:28:51
de_Kt6gXrOIE5tomqlmmq3ZjW0GGJsNZ	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:28:51
6TK7lOMVM4x2bazOfRLlSXafhz5x0XnJ	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:29:16
aVoWnsxsDpghkpdu7jlW1KlnjgIIce1o	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:29:16
IawxVJ2j-KLCCDFzBSzXD5wwCcoovfwo	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:48:09
HaPcELdmTUFcLFnOjby5GY1LYgXAaNPw	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 16:48:09
UPp6ImNErxuz0pi6kX-YVJSLJW10YJcF	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:08:35
zOzc9-1TJY32pQFlLK1CR6s3OmtZQP5x	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:08:35
xoLm7jWTVAc5JSHZ6VdX7VdNPIe-prUj	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"userId":9}	2024-10-19 17:08:40
Mf7cS93u_sBW9wRaYNeapaC5rlDC3Beb	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:11:55
5sTN1ammEs_xMfQPsSZ2V4sEA7sMBd8G	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:11:55
Ea2yXqc7kzZOg5KtdUyPK8RShazrTWzf	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:11:57
fFmLcaoco5VszK6ZmcGTGfnMRXgc3t6I	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:11:58
Bo9j_4vg8rIhQZw6Sa5yfSYqhWcymTox	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:11:59
zw3E5LImGcnc37iflRoj4qZO9vLjJaeJ	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:13:28
ELVhsxIFtTkOSIUXAB1TzXeKrQ-QLSi5	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:13:28
hfhJYKu3CSF51-9pK3NWFhSsAr7LEIzr	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"userId":9}	2024-10-19 17:13:32
4g5ebQUclwuGSqKxP012fRqZLL9xT02C	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:17:09
g6eATAf_s9T-EFqHR4wfDUcuRnMnCBWM	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:17:09
_S40b2-yImQ1WPrfGdK6MmCiyN_HIc29	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:19:29
J3QLOy6cmsUinqDc4FJq03vZfazcFztd	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:19:30
BjhyRJSEOi_VD2Rd4hh7upEh1nriHx4V	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:20:32
AtEDeIXZAVUbsOWhgZIfDyQiOfAEn3J2	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:20:32
CqsYnsqkgmxi1IuQQZ-ZbGOKVu-dtX1P	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:20:32
EylTb8bnJfrgna-oDNfw8mN3Px2HupEO	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:20:32
bI7Vuk93v34hbnxwNdbXpFq_HWjZxciu	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:20:35
I4-2uDBMdafbiQ92b5_8nQhV555edord	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:20:35
D23gfYimV8tvl-sWnOn9u2Ka5qDJtYES	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:20:35
4MaId3WZ-RCIPrccrVfmQTbxCzUwuL9g	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:20:35
M42B7hCy5Zns5UqdhfVhucF9BsANpo-0	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:20:36
eMHsVd7YP7TBSlVjMayrKZUWf4I0MqHn	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:20:36
3X0qZ2yEIPO0CoWM45fBXxm5N0v1GyVy	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:20:45
smGVS3c97LrhovglO496boGcL33AEUjE	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:20:45
9BgZwyALa06vJ8zcyEU4768dRe2l5Kr0	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:20:51
j7Vu2iYYcXyYNFGSv3X9hsqLHQ-vjtIn	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}	2024-10-19 17:20:51
\.


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- PostgreSQL database dump complete
--

