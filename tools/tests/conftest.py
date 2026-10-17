# Betik biçimli test dosyaları: test fonksiyonlarını main() kendi hazırladığı klasörle çağırır (test_x(tmp), test_y(k) …),
# pytest bunları tek tek toplayamaz (fikstür yok). pytest bu dosyaları atlar; test_betikler.py her birini betik olarak koşar.
from test_betikler import BETIKLER

collect_ignore = list(BETIKLER)
