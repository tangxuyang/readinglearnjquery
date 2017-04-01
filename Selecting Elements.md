jQuery提供了css3兼容的选择符机制。我个人认为jQuery之所以能流行起来就是它提供的选择符让人太难拒绝了！！  
## 通过ID选择
$('#xxx')

## 通过类
$('.xxx')

## 通过属性
$('[name=xxx]') 属性等于xxx
$('[name*=xxx]')属性包含xxx
$('[name^=xxx]')属性以xxx开头
$('[name$=xxx]')属性以xxx结尾


## 符合选择符
$('#xxx .xxxx')

## 逗号隔开
$('#xxx, .xxxx')

## 伪选择符
1. :first
2. :odd
3. :even
4. :input
5. :selected
6. :checkbox
7. :checked
8. :button
9. :visible  
 用width和height都为0来判断，不过对于tr有点特殊，用display:none来判断
10. :gt
11. :lt
12. :animated
13. :hidden
 通visible
14. :disabled
15. :enabled
16. :password
17. :reset
18. :radio
19. :text
20. :submit
21. :image
22. :file
 
 
 
 .has
 .is
 .filter
 .find
 .eq
 .first
 .not
 