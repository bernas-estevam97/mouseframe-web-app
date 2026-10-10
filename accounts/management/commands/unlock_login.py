from django.conf import settings
from django.core.cache import cache
from django.core.management.base import BaseCommand, CommandError

from mouseapp.middleware import ip_key, user_key


class Command(BaseCommand):
    help = ("Show or reset the failed-login counter of an IP and/or username. "
            "Unlike clear_cache, nobody else gets logged out.")

    def add_arguments(self, parser):
        parser.add_argument('--ip', help='IP address to unlock, e.g. 203.0.113.7')
        parser.add_argument('--user', help='Username to unlock')
        parser.add_argument('--check', action='store_true', help='Only show the counters, change nothing')

    def handle(self, *args, ip=None, user=None, check=False, **options):
        if not ip and not user:
            raise CommandError('Give --ip, --user or both.')
        targets = []
        if ip:
            targets.append(('IP', ip, ip_key(ip), settings.MAX_FAILED_LOGINS_PER_IP))
        if user:
            targets.append(('user', user, user_key(user), settings.MAX_FAILED_LOGINS_PER_USER))

        for label, target, key, limit in targets:
            attempts = cache.get(key, 0)
            state = 'LOCKED' if attempts >= limit else 'not locked'
            if check:
                self.stdout.write(f'{label} {target}: {attempts}/{limit} failed attempts, {state}')
            else:
                cache.delete(key)
                self.stdout.write(self.style.SUCCESS(f'{label} {target}: reset (was {attempts}/{limit}, {state})'))
