#!/usr/bin/perl
#use WWW::Mailgun;

$filelocation="../../data";
$file="speedimport_0.3.tar.gz";
$filesz= -s $file;

#print "Content-Type: application/force-download\n\n";
#print "Content-Length:" . $filesz."\n";
#print "Content-Disposition: inline; filename=\"".$file."\"\n\n";

open(DLFILE, "<$filelocation/$file") || Error('open', 'file');

@fileholder = <DLFILE>;

close (DLFILE) || Error ('close', 'file');

print "Content-Type:application/x-download\n";
print "Content-Length: $filesz\n";
print "Content-Disposition:attachment;filename=$file\n\n";



print @fileholder;

#print "Content-Type: application/json\n\n";
#print <<EndOfJSON;
#{
#"url": "http://www.infolution.biz"
#}
#EndOfJSON

