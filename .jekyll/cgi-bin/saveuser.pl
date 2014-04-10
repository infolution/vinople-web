#!/usr/bin/perl
#use WWW::Mailgun;
use Data::Dumper;
use CGI;
#use Text::CSV_XS;

my $q = CGI->new;

print "Content-Type: application/json\n\n";

my %data;
$data{name} = $q->param('name');
$data{company} = $q->param('company');
$data{email} = $q->param('email');
$data{time} = localtime();
$data{timestamp} = time();

#print "$data{timestamp}\n";

#$data{name} = "Mislav Kasner";
#$data{company} = "Infolution LLC";
#$data{email} = "mislav\@infolution.biz";

$filelocation="../../data/";
$file="${filelocation}freedownloads.csv";

#print $file;

#my $csv = Text::CSV_XS->new ({ binary => 1, auto_diag => 1 });
open $fh, ">>:encoding(utf8)", $file or die "$file: $!";



#print $q->header;
#print Dumper \%data;

#print join( ',', $data ), "\n";

print $fh "$data{name},$data{company},$data{email},$data{time},$data{timestamp}\n";
#print "\n";
close($fh);


print <<EndOfJSON;
{
"success": true
}
EndOfJSON

print "\n";


