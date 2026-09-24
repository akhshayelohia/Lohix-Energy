-- Repairs two symbols that were garbled when pending-paste.sql went through the Windows clipboard:
--   em dash  (shown as "GammaCo..")  ->  —
--   middle dot (shown as box glyphs) ->  ·
-- This file is plain ASCII on purpose, so it survives copy/paste. Safe to run more than once.

BEGIN;

UPDATE public.site_content
SET data = replace(
             replace(data::text, chr(915) || chr(199) || chr(246), chr(8212)),
             chr(9516) || chr(9558), chr(183)
           )::jsonb
WHERE data::text LIKE '%' || chr(915) || chr(199) || chr(246) || '%'
   OR data::text LIKE '%' || chr(9516) || chr(9558) || '%';

COMMIT;
