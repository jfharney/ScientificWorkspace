%% Generated by the Erlang ASN.1 compiler version:3.0.1
%% Purpose: Erlang record definitions for each named and unnamed
%% SEQUENCE and SET, and macro definitions for each value
%% definition,in module ELDAPv3



-ifndef(_ELDAPV3_HRL_).
-define(_ELDAPV3_HRL_, true).

-record('LDAPMessage',{
messageID, protocolOp, controls = asn1_NOVALUE}).

-record('AttributeValueAssertion',{
attributeDesc, assertionValue}).

-record('Attribute',{
type, vals}).

-record('LDAPResult',{
resultCode, matchedDN, errorMessage, referral = asn1_NOVALUE}).

-record('Control',{
controlType, criticality = asn1_DEFAULT, controlValue = asn1_NOVALUE}).

-record('BindRequest',{
version, name, authentication}).

-record('SaslCredentials',{
mechanism, credentials = asn1_NOVALUE}).

-record('BindResponse',{
resultCode, matchedDN, errorMessage, referral = asn1_NOVALUE, serverSaslCreds = asn1_NOVALUE}).

-record('SearchRequest',{
baseObject, scope, derefAliases, sizeLimit, timeLimit, typesOnly, filter, attributes}).

-record('SubstringFilter',{
type, substrings}).

-record('MatchingRuleAssertion',{
matchingRule = asn1_NOVALUE, type = asn1_NOVALUE, matchValue, dnAttributes = asn1_DEFAULT}).

-record('SearchResultEntry',{
objectName, attributes}).

-record('PartialAttributeList_SEQOF',{
type, vals}).

-record('ModifyRequest',{
object, modification}).

-record('ModifyRequest_modification_SEQOF',{
operation, modification}).

-record('AttributeTypeAndValues',{
type, vals}).

-record('AddRequest',{
entry, attributes}).

-record('AttributeList_SEQOF',{
type, vals}).

-record('ModifyDNRequest',{
entry, newrdn, deleteoldrdn, newSuperior = asn1_NOVALUE}).

-record('CompareRequest',{
entry, ava}).

-record('ExtendedRequest',{
requestName, requestValue = asn1_NOVALUE}).

-record('ExtendedResponse',{
resultCode, matchedDN, errorMessage, referral = asn1_NOVALUE, responseName = asn1_NOVALUE, response = asn1_NOVALUE}).

-define('maxInt', 2147483647).
-endif. %% _ELDAPV3_HRL_
