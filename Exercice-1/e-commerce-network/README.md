
# Exercice 1 : e-commerce-network

>  Bonjour :) dans cet exercice nous allons compléter le sénario de reglement de letiges numéro 3 représenté dans la figure img2.png .l'acheteur  n'étant pas satisfait du produis va exiger un remboursement auprés du vendeur . le vendeur accepte et lui rend une réponse affermative , puis il transfere l'argent de son compte vers celui de la banque .
La banque bloque ensuite cette somme chez elle jusqu'a ce que l'acheteur envoit sa requête de rembourssement. Quand cette requete est envoyé la banque transfere l'argent de son compte vers celui de l'acheteur .

On rappelle que dans notre model :

**Participant**
`Seller` `Byer` `FinanceCo` `Shipper`

**Asset**
`Order`

**Transaction**
`Dispute`

Cette transaction permet à l'acheteur d'initiser un létige avec le vendeur  :
La logique de cette transaction peut être décrite comme suite :
l'algorithme vérifie que le `status` de **Order** est Delivred  .
ensuite il procéde  à la mise a jour de ce `status` en Dispute , du `disputeMsg` en le message de l'acheteur et de la date `disputeOpened` en la date courante. Il persiste ensuite ces mises à jours dans le registre de la Blockchain .

**Transaction**
`ResolveForRefund`

Cette transaction permet au vendeur de repondre a la requête de l'acheteur en acceptant sa requête de remboursement  :
La logique de cette transaction peut être décrite comme suite :
l'algorithme vérifie que le `status` de **Order** est Dispute  .
ensuite il procéde  à la mise a jour de ce `status` en ToRefund ,  de la date `disputeResolved` en la date courante. Il persiste ensuite ces mises à jours dans le registre de la Blockchain .

**Transaction**
`Refund`

Cette transaction permet au vendeur d'envoyer la somme qui va être remboursé à la banque   :
La logique de cette transaction peut être décrite comme suite :
l'algorithme vérifie que le `status` de **Order** est ToRefund  .
ensuite il déduit le prix de la commande `amount`  de la `balance` du vendeur et l'ajoute a celle de la banque. Ensuite il procéde   à la mise a jour de ce `status` en Refund ,  de la date `refundDate` en la date courante. Il persiste ensuite ces mises à jours dans le registre de la Blockchain .

**Transaction**
`Request-Refund`

Cette transaction permet à l'acheteur de demander un romboursement auprés de la banque  :
La logique de cette transaction peut être décrite comme suite :
l'algorithme vérifie que le `status` de **Order** est Refund  .
ensuite il procéde  à la mise a jour de ce `status` en Redund_Request , de la date `refundRequestedDate` en la date courante. Il persiste ensuite ces mises à jours dans le registre de la Blockchain .

**Transaction**
`GetRefund`

Cette transaction permet à la banque de rembourcer l'acheteur   :
La logique de cette transaction peut être décrite comme suite :
l'algorithme vérifie que le `status` de **Order** est Refund_Requested  .
ensuite il déduit le prix de la commande `amount`  de la `balance` du la banque et l'ajoute a celle de l'acheteur. Ensuite il procéde   à la mise a jour de ce `status` en Refund ,  de la date `refundDate` en la date courante. Il persiste ensuite ces mises à jours dans le registre de la Blockchain .

**Test**
1-suivez le sénario dans img1.png
2-developper le sénario dans img2.png
3-suivez le sénario dans img2.png

**Mode de Travail**
Vous pouvez travaillez en mode developpeur comme dans le tutoriel 6 et 7 .
1-Forkez le répértoire de sintgralabs/Hyperledger-Composer-Exercice . 2-Clonez ce repértoire et Mettez le à jours
3-Suivez le tutoriel forkandclone pour mettre a jour votre repértoire forké
4-Envoyez un mail avec votre addresse publique de ce répértoire

Bon Courage!
